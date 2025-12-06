import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { CaseEditor } from '@/components/operator/CaseEditor'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditCasePage({ params }: PageProps) {
  const { id } = await params
  
  const caseData = await prisma.case.findUnique({
    where: { id },
    include: {
      sourceArticles: true,
      exhibits: { orderBy: { order: 'asc' } },
      questions: { orderBy: { order: 'asc' } },
      concepts: { include: { concept: true } }
    },
    // Include featuredImage in the result
  })

  if (!caseData) {
    notFound()
  }

  const allConcepts = await prisma.concept.findMany({
    orderBy: { category: 'asc' }
  })

  // Safely parse content - handle both object and array formats
  let parsedContent: { title: string; content: string }[] = []
  try {
    const parsed = caseData.content ? JSON.parse(caseData.content) : null
    if (Array.isArray(parsed)) {
      // Legacy format: content is a direct array
      parsedContent = parsed
    } else if (parsed?.sections && Array.isArray(parsed.sections)) {
      // New format: content is an object with sections property
      parsedContent = parsed.sections
    }
  } catch (e) {
    console.error('Failed to parse case content:', e)
  }

  return (
    <CaseEditor
      caseData={{
        ...caseData,
        content: parsedContent,
        exhibits: caseData.exhibits.map(e => ({
          ...e,
          data: JSON.parse(e.data)
        }))
      }}
      allConcepts={allConcepts}
    />
  )
}

