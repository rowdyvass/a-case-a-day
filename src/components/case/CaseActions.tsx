'use client'

import { Button } from '@/components/ui'
import { Printer, Share2 } from 'lucide-react'

interface CaseActionsProps {
  title: string
  summary: string
}

export function CaseActions({ title, summary }: CaseActionsProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: summary,
          url: window.location.href
        })
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="flex items-center justify-end gap-2 mb-8 print:hidden">
      <Button variant="ghost" size="sm" onClick={handlePrint}>
        <Printer className="h-4 w-4 mr-1" />
        Print
      </Button>
      <Button variant="ghost" size="sm" onClick={handleShare}>
        <Share2 className="h-4 w-4 mr-1" />
        Share
      </Button>
    </div>
  )
}


