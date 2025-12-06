import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db'

// GET - List all jobs for current user or get specific job by ID
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('id')
    const userId = (session.user as { id: string }).id

    if (jobId) {
      // Get specific job
      const job = await prisma.caseGenerationJob.findFirst({
        where: {
          id: jobId,
          userId
        }
      })

      if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 })
      }

      return NextResponse.json({
        ...job,
        concepts: job.concepts ? JSON.parse(job.concepts) : []
      })
    }

    // List all active jobs (not completed or failed more than 24h ago)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    const jobs = await prisma.caseGenerationJob.findMany({
      where: {
        userId,
        OR: [
          { status: { in: ['pending', 'extracting', 'analyzing', 'researching', 'generating_case', 'generating_exhibits', 'generating_questions'] } },
          { status: 'completed', updatedAt: { gte: oneDayAgo } },
          { status: 'failed', updatedAt: { gte: oneDayAgo } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json({
      jobs: jobs.map(job => ({
        ...job,
        concepts: job.concepts ? JSON.parse(job.concepts) : []
      }))
    })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

// POST - Create a new generation job
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    console.log('Jobs POST - Session:', session ? 'exists' : 'null', 'User:', session?.user?.email)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Jobs POST - Body keys:', Object.keys(body))
    const {
      sourceType,
      sourceUrl,
      sourceTitle,
      sourceContent,
      company,
      industry,
      concepts,
      // Category metadata
      category,
      publishedDate,
      track,
      skill,
      difficulty,
    } = body

    if (!sourceContent) {
      return NextResponse.json(
        { error: 'Source content is required' },
        { status: 400 }
      )
    }

    const userId = (session.user as { id: string }).id
    console.log('Jobs POST - User ID:', userId)

    const job = await prisma.caseGenerationJob.create({
      data: {
        userId,
        sourceType: sourceType || 'text',
        sourceUrl,
        sourceTitle,
        sourceContent,
        company,
        industry,
        concepts: concepts ? JSON.stringify(concepts) : null,
        // Category metadata
        category: category || 'daily',
        publishedDate: publishedDate ? new Date(publishedDate) : null,
        track: track || null,
        skill: skill || null,
        difficulty: difficulty || 'intermediate',
        status: 'pending',
        progress: 0,
        currentStep: 'Queued for processing'
      }
    })

    return NextResponse.json({
      id: job.id,
      status: job.status,
      message: 'Job created successfully'
    })
  } catch (error) {
    console.error('Error creating job:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to create job: ${errorMessage}` },
      { status: 500 }
    )
  }
}

// PATCH - Update job status (cancel)
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, action } = await request.json()
    const userId = (session.user as { id: string }).id

    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    // Verify job belongs to user
    const existingJob = await prisma.caseGenerationJob.findFirst({
      where: { id, userId }
    })

    if (!existingJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    if (action === 'cancel') {
      // Only allow cancellation of pending or in-progress jobs
      const cancellableStatuses = ['pending', 'extracting', 'analyzing', 'researching', 'generating_case', 'generating_exhibits', 'generating_questions']
      
      if (!cancellableStatuses.includes(existingJob.status)) {
        return NextResponse.json(
          { error: 'Job cannot be cancelled in current state' },
          { status: 400 }
        )
      }

      await prisma.caseGenerationJob.update({
        where: { id },
        data: {
          status: 'cancelled',
          currentStep: 'Cancelled by user'
        }
      })

      return NextResponse.json({ success: true, message: 'Job cancelled' })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    )
  }
}

// DELETE - Remove a job
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const userId = (session.user as { id: string }).id

    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    // Verify job belongs to user
    const existingJob = await prisma.caseGenerationJob.findFirst({
      where: { id, userId }
    })

    if (!existingJob) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    await prisma.caseGenerationJob.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Job deleted' })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    )
  }
}

