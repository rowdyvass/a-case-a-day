import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'
import { getAIProvider } from '@/lib/ai'
import { slugify } from '@/lib/utils'
import type { GenerationContext, Exhibit, ProtagonistProfile } from '@/lib/ai/providers/types'
import { validateCustomExhibit } from '@/lib/exhibits/custom-exhibit-schema'
import { getVarietyGuidance, analyzeExhibitVariety, getVarietySummary } from '@/lib/exhibits/variety'

// Helper to update job status
async function updateJobStatus(
  jobId: string,
  status: string,
  progress: number,
  currentStep: string,
  extra?: Record<string, unknown>
) {
  await prisma.caseGenerationJob.update({
    where: { id: jobId },
    data: {
      status,
      progress,
      currentStep,
      ...extra
    }
  })
}

// Check if job was cancelled
async function isJobCancelled(jobId: string): Promise<boolean> {
  const job = await prisma.caseGenerationJob.findUnique({
    where: { id: jobId },
    select: { status: true }
  })
  return job?.status === 'cancelled'
}

// Validate exhibits
function validateAndFilterExhibits(exhibits: Exhibit[]): Exhibit[] {
  return exhibits.filter((exhibit) => {
    if (exhibit.type !== 'custom_interactive') {
      return true
    }
    const validation = validateCustomExhibit(exhibit.data)
    if (!validation.valid) {
      console.warn(`Custom exhibit "${exhibit.title}" failed validation:`, validation.errors)
      return false
    }
    return true
  })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: jobId } = await params
  
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = (session.user as { id: string }).id

    // Get the job
    const job = await prisma.caseGenerationJob.findFirst({
      where: { id: jobId, userId }
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    if (job.status !== 'pending') {
      return NextResponse.json(
        { error: 'Job is not in pending state' },
        { status: 400 }
      )
    }

    // Start processing
    const provider = getAIProvider()
    
    // Step 1: Analyze content (if company/industry not provided)
    if (!job.company || !job.industry) {
      await updateJobStatus(jobId, 'analyzing', 10, 'Analyzing article content...')
      
      if (await isJobCancelled(jobId)) {
        return NextResponse.json({ message: 'Job cancelled' })
      }

      const concepts = await prisma.concept.findMany({
        select: { name: true, category: true }
      })

      const analysis = await provider.analyzeContent(
        job.sourceContent || '',
        concepts.map(c => ({ name: c.name, category: c.category }))
      )

      await prisma.caseGenerationJob.update({
        where: { id: jobId },
        data: {
          company: job.company || analysis.company.name,
          industry: job.industry || analysis.industry.primary,
          concepts: job.concepts || JSON.stringify(analysis.recommendedConcepts.map(c => c.name))
        }
      })
    }

    // Refresh job data
    const updatedJob = await prisma.caseGenerationJob.findUnique({
      where: { id: jobId }
    })

    if (!updatedJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    const companyName = updatedJob.company || 'Unknown Company'
    const industry = updatedJob.industry || 'Technology'
    const targetConcepts = updatedJob.concepts 
      ? JSON.parse(updatedJob.concepts) 
      : ['Strategy', 'Finance', 'Marketing']

    // Step 2: Research company
    await updateJobStatus(jobId, 'researching', 20, `Researching ${companyName}...`)
    
    if (await isJobCancelled(jobId)) {
      return NextResponse.json({ message: 'Job cancelled' })
    }

    const researchData = await provider.researchCompany(companyName, industry)

    // Step 3: Generate protagonist
    await updateJobStatus(jobId, 'generating_case', 35, 'Creating case protagonist...')
    
    if (await isJobCancelled(jobId)) {
      return NextResponse.json({ message: 'Job cancelled' })
    }

    const sourceContent = updatedJob.sourceContent || ''
    const situationSummary = sourceContent.slice(0, 2000)
    let protagonist: ProtagonistProfile | undefined

    try {
      protagonist = await provider.generateProtagonist(
        companyName,
        industry,
        situationSummary,
        researchData
      )
      console.log(`Protagonist created: ${protagonist.name}, ${protagonist.role}`)
    } catch (error) {
      console.warn('Failed to generate protagonist, proceeding without:', error)
    }

    // Step 4: Generate case content
    await updateJobStatus(jobId, 'generating_case', 50, 'Generating protagonist-centered case narrative...')
    
    if (await isJobCancelled(jobId)) {
      return NextResponse.json({ message: 'Job cancelled' })
    }

    const context: GenerationContext = {
      sourceArticle: sourceContent,
      targetConcepts,
      protagonist
    }
    const caseContent = await provider.generateCase(context, researchData)

    // Step 5: Get variety guidance and generate exhibits
    await updateJobStatus(jobId, 'generating_exhibits', 65, 'Creating exhibits and visualizations...')
    
    if (await isJobCancelled(jobId)) {
      return NextResponse.json({ message: 'Job cancelled' })
    }

    const varietyGuidance = await getVarietyGuidance()
    const rawExhibits = await provider.generateExhibits(caseContent, varietyGuidance)
    const exhibits = validateAndFilterExhibits(rawExhibits)

    const varietyAnalysis = analyzeExhibitVariety(
      exhibits.map(e => ({ type: e.type, title: e.title })),
      varietyGuidance.stats
    )
    console.log(`Exhibit variety: ${getVarietySummary(varietyAnalysis)}`)

    // Step 6: Generate questions
    await updateJobStatus(jobId, 'generating_questions', 85, 'Creating discussion questions...')
    
    if (await isJobCancelled(jobId)) {
      return NextResponse.json({ message: 'Job cancelled' })
    }

    const questions = await provider.generateQuestions(caseContent, targetConcepts)

    // Step 7: Save to database
    await updateJobStatus(jobId, 'generating_questions', 95, 'Saving case...')

    // Create slug
    const baseSlug = slugify(caseContent.title)
    let slug = baseSlug
    let counter = 1
    
    while (await prisma.case.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Prepare content with protagonist data
    const finalProtagonist = caseContent.protagonist || protagonist
    const contentData = {
      sections: caseContent.sections,
      protagonist: finalProtagonist
    }

    // Save case
    const savedCase = await prisma.case.create({
      data: {
        slug,
        title: caseContent.title,
        company: caseContent.company || companyName,
        industry: caseContent.industry || industry,
        summary: caseContent.summary,
        content: JSON.stringify(contentData),
        status: 'draft',
        authorId: userId,
        // Case categorization from job
        category: updatedJob.category || 'daily',
        publishedDate: updatedJob.publishedDate,
        track: updatedJob.track,
        skill: updatedJob.skill,
        difficulty: updatedJob.difficulty || 'intermediate',
        sourceArticles: {
          create: {
            type: updatedJob.sourceType,
            title: updatedJob.sourceTitle,
            content: updatedJob.sourceContent || '',
            url: updatedJob.sourceUrl
          }
        },
        exhibits: {
          create: exhibits.map((exhibit, index) => ({
            type: exhibit.type,
            title: exhibit.title,
            data: JSON.stringify(exhibit.data),
            order: index
          }))
        },
        questions: {
          create: questions.map((question, index) => ({
            text: question.text,
            difficulty: question.difficulty,
            order: index
          }))
        }
      }
    })

    // Link concepts
    if (targetConcepts && targetConcepts.length > 0) {
      const conceptRecords = await prisma.concept.findMany({
        where: { name: { in: targetConcepts } }
      })

      if (conceptRecords.length > 0) {
        await prisma.caseConcept.createMany({
          data: conceptRecords.map((concept) => ({
            caseId: savedCase.id,
            conceptId: concept.id
          }))
        })
      }
    }

    // Mark job as completed
    await updateJobStatus(jobId, 'completed', 100, 'Case created successfully!', {
      caseId: savedCase.id
    })

    return NextResponse.json({
      success: true,
      caseId: savedCase.id,
      slug: savedCase.slug,
      title: savedCase.title
    })
  } catch (error) {
    console.error('Job processing error:', error)
    
    // Mark job as failed
    await prisma.caseGenerationJob.update({
      where: { id: jobId },
      data: {
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        currentStep: 'Failed'
      }
    }).catch(console.error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process job' },
      { status: 500 }
    )
  }
}

