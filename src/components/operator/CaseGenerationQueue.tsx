'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Trash2
} from 'lucide-react'

interface GenerationJob {
  id: string
  status: string
  progress: number
  currentStep: string
  company?: string
  industry?: string
  sourceTitle?: string
  caseId?: string
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Queued',
  extracting: 'Extracting content',
  analyzing: 'Analyzing article',
  researching: 'Researching company',
  generating_case: 'Writing case narrative',
  generating_exhibits: 'Creating exhibits',
  generating_questions: 'Generating questions',
  completed: 'Complete',
  failed: 'Failed',
  cancelled: 'Cancelled'
}

const STATUS_PROGRESS: Record<string, number> = {
  pending: 0,
  extracting: 5,
  analyzing: 15,
  researching: 30,
  generating_case: 50,
  generating_exhibits: 70,
  generating_questions: 85,
  completed: 100,
  failed: 0,
  cancelled: 0
}

interface CaseGenerationQueueProps {
  compact?: boolean
  showCompleted?: boolean
  maxItems?: number
  onJobComplete?: (job: GenerationJob) => void
}

export function CaseGenerationQueue({ 
  compact = false,
  showCompleted = true,
  maxItems = 10,
  onJobComplete
}: CaseGenerationQueueProps) {
  const router = useRouter()
  const [jobs, setJobs] = useState<GenerationJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(!compact)
  const [previousCompleted, setPreviousCompleted] = useState<Set<string>>(new Set())

  const fetchJobs = useCallback(async () => {
    try {
      const response = await fetch('/api/cases/jobs')
      if (response.ok) {
        const data = await response.json()
        const fetchedJobs = data.jobs as GenerationJob[]
        
        // Check for newly completed jobs
        fetchedJobs.forEach(job => {
          if (job.status === 'completed' && !previousCompleted.has(job.id)) {
            onJobComplete?.(job)
          }
        })
        
        setPreviousCompleted(new Set(
          fetchedJobs.filter(j => j.status === 'completed').map(j => j.id)
        ))
        
        setJobs(fetchedJobs)
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err)
    } finally {
      setIsLoading(false)
    }
  }, [onJobComplete, previousCompleted])

  useEffect(() => {
    fetchJobs()
    const interval = setInterval(fetchJobs, 2000)
    return () => clearInterval(interval)
  }, [fetchJobs])

  const handleCancel = async (jobId: string) => {
    try {
      await fetch('/api/cases/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: jobId, action: 'cancel' })
      })
      fetchJobs()
    } catch (err) {
      console.error('Failed to cancel job:', err)
    }
  }

  const handleDelete = async (jobId: string) => {
    try {
      await fetch(`/api/cases/jobs?id=${jobId}`, {
        method: 'DELETE'
      })
      fetchJobs()
    } catch (err) {
      console.error('Failed to delete job:', err)
    }
  }

  const handleViewCase = (caseId: string) => {
    router.push(`/operator/cases/${caseId}/edit`)
  }

  // Filter jobs based on settings
  const filteredJobs = jobs
    .filter(job => showCompleted || !['completed', 'failed', 'cancelled'].includes(job.status))
    .slice(0, maxItems)

  const activeJobCount = jobs.filter(j => 
    !['completed', 'failed', 'cancelled'].includes(j.status)
  ).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
      </div>
    )
  }

  if (filteredJobs.length === 0) {
    return null
  }

  if (compact) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {activeJobCount > 0 && (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                <span className="text-sm font-medium text-slate-700">
                  {activeJobCount} case{activeJobCount !== 1 ? 's' : ''} generating
                </span>
              </div>
            )}
            {activeJobCount === 0 && filteredJobs.length > 0 && (
              <span className="text-sm text-slate-500">
                {filteredJobs.length} recent job{filteredJobs.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </button>
        
        {isExpanded && (
          <div className="border-t border-slate-100 divide-y divide-slate-100">
            {filteredJobs.map((job) => (
              <JobRow 
                key={job.id} 
                job={job}
                onCancel={() => handleCancel(job.id)}
                onDelete={() => handleDelete(job.id)}
                onViewCase={job.caseId ? () => handleViewCase(job.caseId!) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filteredJobs.map((job) => (
        <JobCard 
          key={job.id} 
          job={job}
          onCancel={() => handleCancel(job.id)}
          onDelete={() => handleDelete(job.id)}
          onViewCase={job.caseId ? () => handleViewCase(job.caseId!) : undefined}
        />
      ))}
    </div>
  )
}

// Full card view for job
function JobCard({ 
  job, 
  onCancel, 
  onDelete,
  onViewCase 
}: { 
  job: GenerationJob
  onCancel: () => void
  onDelete: () => void
  onViewCase?: () => void
}) {
  const isActive = !['completed', 'failed', 'cancelled'].includes(job.status)
  const progress = job.progress || STATUS_PROGRESS[job.status] || 0

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <StatusIcon status={job.status} />
          <div>
            <h3 className="font-medium text-slate-900">
              {job.company || job.sourceTitle || 'Processing...'}
            </h3>
            {job.industry && (
              <p className="text-sm text-slate-500">{job.industry}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {!isActive && job.status !== 'completed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-slate-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          {job.status === 'completed' && onViewCase && (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewCase}
              className="gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              View
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {isActive && (
        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Status */}
      <div className="flex items-center justify-between text-sm">
        <span className={`${
          job.status === 'failed' ? 'text-red-600' :
          job.status === 'completed' ? 'text-emerald-600' :
          'text-slate-600'
        }`}>
          {job.currentStep || STATUS_LABELS[job.status]}
        </span>
        {isActive && (
          <span className="text-slate-400">{progress}%</span>
        )}
      </div>

      {job.errorMessage && (
        <p className="mt-2 text-sm text-red-600 bg-red-50 rounded px-2 py-1">
          {job.errorMessage}
        </p>
      )}
    </div>
  )
}

// Compact row view for job
function JobRow({ 
  job, 
  onCancel, 
  onDelete,
  onViewCase 
}: { 
  job: GenerationJob
  onCancel: () => void
  onDelete: () => void
  onViewCase?: () => void
}) {
  const isActive = !['completed', 'failed', 'cancelled'].includes(job.status)
  const progress = job.progress || STATUS_PROGRESS[job.status] || 0

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <StatusIcon status={job.status} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {job.company || job.sourceTitle || 'Processing...'}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {job.currentStep || STATUS_LABELS[job.status]}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          {isActive && (
            <>
              <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <button
                onClick={onCancel}
                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          )}
          {job.status === 'completed' && onViewCase && (
            <button
              onClick={onViewCase}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View
            </button>
          )}
          {!isActive && job.status !== 'completed' && (
            <button
              onClick={onDelete}
              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Status icon component
function StatusIcon({ status, size = 'md' }: { status: string; size?: 'sm' | 'md' }) {
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  
  switch (status) {
    case 'completed':
      return <CheckCircle2 className={`${iconSize} text-emerald-500`} />
    case 'failed':
      return <AlertCircle className={`${iconSize} text-red-500`} />
    case 'cancelled':
      return <X className={`${iconSize} text-slate-400`} />
    default:
      return <Loader2 className={`${iconSize} animate-spin text-indigo-500`} />
  }
}

export default CaseGenerationQueue


