'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { Eye, Edit, Send, Loader2, EyeOff } from 'lucide-react'

interface CaseActionsProps {
  caseId: string
  caseSlug: string
  status: string
}

export function CaseActions({ caseId, caseSlug, status }: CaseActionsProps) {
  const router = useRouter()
  const [isPublishing, setIsPublishing] = useState(false)
  const [isUnpublishing, setIsUnpublishing] = useState(false)

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      const response = await fetch(`/api/cases/${caseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'published' })
      })

      if (!response.ok) {
        throw new Error('Failed to publish case')
      }

      router.refresh()
    } catch (error) {
      console.error('Failed to publish:', error)
      alert('Failed to publish case. Please try again.')
    } finally {
      setIsPublishing(false)
    }
  }

  const handleUnpublish = async () => {
    setIsUnpublishing(true)
    try {
      const response = await fetch(`/api/cases/${caseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'draft' })
      })

      if (!response.ok) {
        throw new Error('Failed to unpublish case')
      }

      router.refresh()
    } catch (error) {
      console.error('Failed to unpublish:', error)
      alert('Failed to unpublish case. Please try again.')
    } finally {
      setIsUnpublishing(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* Preview/View button - always show, opens in new tab */}
      <Link href={`/cases/${caseSlug}`} target="_blank">
        <Button variant="ghost" size="sm" className="gap-1">
          <Eye className="h-4 w-4" />
          {status === 'published' ? 'View' : 'Preview'}
        </Button>
      </Link>

      {/* Publish/Unpublish button */}
      {status === 'draft' ? (
        <Button
          variant="primary"
          size="sm"
          className="gap-1"
          onClick={handlePublish}
          disabled={isPublishing}
        >
          {isPublishing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Publish
        </Button>
      ) : status === 'published' ? (
        <Button
          variant="outline"
          size="sm"
          className="gap-1 text-amber-600 hover:text-amber-700"
          onClick={handleUnpublish}
          disabled={isUnpublishing}
        >
          {isUnpublishing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
          Unpublish
        </Button>
      ) : null}

      {/* Edit button */}
      <Link href={`/operator/cases/${caseId}/edit`}>
        <Button variant="outline" size="sm" className="gap-1">
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </Link>
    </div>
  )
}


