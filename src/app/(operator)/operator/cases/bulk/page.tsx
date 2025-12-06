'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Select } from '@/components/ui'
import { CaseGenerationQueue } from '@/components/operator/CaseGenerationQueue'
import { 
  Search, 
  Loader2, 
  Sparkles, 
  Building2, 
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  X,
  AlertCircle,
  ExternalLink
} from 'lucide-react'

interface CaseIdea {
  title: string
  company: string
  industry: string
  description: string
  year: number
  concepts: string[]
  suggestedSources: {
    publication: string
    topic: string
    searchQuery: string
  }[]
  whyGreatCase: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  selected?: boolean
  generating?: boolean
  generated?: boolean
  jobId?: string
  caseSlug?: string
}

interface Concept {
  id: string
  name: string
  category: string
}

const PATHS = [
  { value: '', label: 'Any Path' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
  { value: 'strategy', label: 'Strategy' },
  { value: 'technology', label: 'Technology' },
  { value: 'entrepreneurship', label: 'Entrepreneurship' }
]

const YEARS = [
  { value: '', label: 'Any Year' },
  { value: '2024', label: '2024' },
  { value: '2023', label: '2023' },
  { value: '2022', label: '2022' },
  { value: '2021', label: '2021' },
  { value: '2020', label: '2020' },
  { value: '2019', label: '2019' },
  { value: '2018', label: '2018' },
  { value: '2015', label: '~2015' },
  { value: '2010', label: '~2010' },
  { value: '2000', label: '~2000' }
]

// Delay between job processing (in milliseconds)
const JOB_DELAY_MS = 3000
// Polling interval for checking job status (in milliseconds)
const POLL_INTERVAL_MS = 2000
// Maximum time to wait for a job to complete (in milliseconds)
const MAX_WAIT_TIME_MS = 5 * 60 * 1000 // 5 minutes

export default function BulkAddPage() {
  const router = useRouter()
  const [company, setCompany] = useState('')
  const [concept, setConcept] = useState('')
  const [path, setPath] = useState('')
  const [year, setYear] = useState('')
  const [concepts, setConcepts] = useState<Concept[]>([])
  const [caseIdeas, setCaseIdeas] = useState<CaseIdea[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  // New state for tracking sequential progress
  const [currentJobIndex, setCurrentJobIndex] = useState(0)
  const [totalJobs, setTotalJobs] = useState(0)
  const [currentJobStatus, setCurrentJobStatus] = useState('')

  // Fetch concepts for dropdown
  useEffect(() => {
    async function fetchConcepts() {
      try {
        const response = await fetch('/api/concepts')
        if (response.ok) {
          const data = await response.json()
          setConcepts(data.concepts)
        }
      } catch (err) {
        console.error('Failed to fetch concepts:', err)
      }
    }
    fetchConcepts()
  }, [])

  const handleSearch = async () => {
    if (!company && !concept && !path && !year) {
      setError('Please provide at least one filter')
      return
    }

    setIsSearching(true)
    setError('')
    setCaseIdeas([])

    try {
      const response = await fetch('/api/cases/research-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          company: company || undefined,
          concept: concept || undefined,
          path: path || undefined,
          year: year ? parseInt(year) : undefined,
          count: 10
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to research case ideas')
      }

      const data = await response.json()
      setCaseIdeas(data.caseIdeas.map((idea: CaseIdea) => ({
        ...idea,
        selected: true
      })))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to research case ideas')
    } finally {
      setIsSearching(false)
    }
  }

  const toggleCaseSelection = (index: number) => {
    setCaseIdeas(prev => prev.map((idea, i) => 
      i === index ? { ...idea, selected: !idea.selected } : idea
    ))
  }

  const selectAll = () => {
    setCaseIdeas(prev => prev.map(idea => ({ ...idea, selected: true })))
  }

  const deselectAll = () => {
    setCaseIdeas(prev => prev.map(idea => ({ ...idea, selected: false })))
  }

  // Helper function to delay execution
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  // Helper function to poll for job completion
  const waitForJobCompletion = async (jobId: string): Promise<{ success: boolean; error?: string; caseId?: string }> => {
    const startTime = Date.now()
    
    while (Date.now() - startTime < MAX_WAIT_TIME_MS) {
      try {
        const response = await fetch(`/api/cases/jobs?id=${jobId}`, {
          credentials: 'include'
        })
        
        if (!response.ok) {
          return { success: false, error: 'Failed to check job status' }
        }
        
        const job = await response.json()
        
        // Update the current step in UI
        setCurrentJobStatus(job.currentStep || 'Processing...')
        
        if (job.status === 'completed') {
          return { success: true, caseId: job.caseId }
        }
        
        if (job.status === 'failed' || job.status === 'cancelled') {
          return { success: false, error: job.errorMessage || `Job ${job.status}` }
        }
        
        // Still processing, wait before polling again
        await delay(POLL_INTERVAL_MS)
      } catch (err) {
        console.error('Error polling job status:', err)
        // Continue polling on network errors
        await delay(POLL_INTERVAL_MS)
      }
    }
    
    return { success: false, error: 'Job timed out' }
  }

  const handleGenerateSelected = async () => {
    const selectedIdeas = caseIdeas.filter(idea => idea.selected && !idea.generated)
    
    if (selectedIdeas.length === 0) {
      setError('Please select at least one case to generate')
      return
    }

    setIsGenerating(true)
    setError('')
    setTotalJobs(selectedIdeas.length)
    setCurrentJobIndex(0)
    setCurrentJobStatus('')

    // Process jobs SEQUENTIALLY with delays
    for (let i = 0; i < selectedIdeas.length; i++) {
      const idea = selectedIdeas[i]
      setCurrentJobIndex(i + 1)
      setCurrentJobStatus('Creating job...')
      
      try {
        // Mark as generating
        setCaseIdeas(prev => prev.map(item => 
          item.title === idea.title ? { ...item, generating: true } : item
        ))

        // Generate a simple source content from the idea
        const sourceContent = `
# ${idea.title}

## Company: ${idea.company}
## Industry: ${idea.industry}
## Year: ${idea.year}

${idea.description}

${idea.whyGreatCase}

### Key Business Concepts
${idea.concepts.join(', ')}

### Suggested Research Sources
${idea.suggestedSources.map(s => `- ${s.publication}: ${s.topic}`).join('\n')}
`.trim()

        // Create job
        const jobResponse = await fetch('/api/cases/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            sourceType: 'text',
            sourceTitle: idea.title,
            sourceContent,
            company: idea.company,
            industry: idea.industry,
            concepts: idea.concepts
          })
        })

        if (!jobResponse.ok) {
          const errorData = await jobResponse.json().catch(() => ({}))
          throw new Error(errorData.error || `Failed to create job (HTTP ${jobResponse.status})`)
        }

        const job = await jobResponse.json()

        // Start processing and WAIT for it to complete
        setCurrentJobStatus('Starting generation...')
        
        const processResponse = await fetch(`/api/cases/jobs/${job.id}/process`, { 
          method: 'POST',
          credentials: 'include' 
        })
        
        if (!processResponse.ok) {
          const errorData = await processResponse.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to start processing')
        }

        // Wait for job to complete before moving to next
        const result = await waitForJobCompletion(job.id)
        
        if (result.success && result.caseId) {
          // Fetch the case to get its slug for navigation
          let caseSlug: string | undefined
          try {
            const caseResponse = await fetch(`/api/cases/${result.caseId}`, {
              credentials: 'include'
            })
            if (caseResponse.ok) {
              const caseData = await caseResponse.json()
              caseSlug = caseData.slug
            }
          } catch (e) {
            console.error('Failed to fetch case slug:', e)
          }
          
          // Update idea with job ID, case slug, and mark as generated
          setCaseIdeas(prev => prev.map(item => 
            item.title === idea.title 
              ? { ...item, generating: false, generated: true, jobId: job.id, caseSlug } 
              : item
          ))
        } else {
          // Job failed, but still mark it so user knows it was attempted
          setCaseIdeas(prev => prev.map(item => 
            item.title === idea.title 
              ? { ...item, generating: false, generated: true, jobId: job.id } 
              : item
          ))
          console.error(`Job failed for "${idea.title}":`, result.error)
        }

        // Add delay before starting next job to respect rate limits
        if (i < selectedIdeas.length - 1) {
          setCurrentJobStatus(`Waiting ${JOB_DELAY_MS / 1000}s before next job...`)
          await delay(JOB_DELAY_MS)
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        console.error('Failed to generate case:', idea.title, 'Error:', errorMessage)
        setError(`Failed to generate "${idea.title}": ${errorMessage}`)
        setCaseIdeas(prev => prev.map(item => 
          item.title === idea.title ? { ...item, generating: false } : item
        ))
        
        // Continue with next job even if this one failed
        if (i < selectedIdeas.length - 1) {
          setCurrentJobStatus(`Waiting ${JOB_DELAY_MS / 1000}s before next job...`)
          await delay(JOB_DELAY_MS)
        }
      }
    }

    setIsGenerating(false)
    setCurrentJobIndex(0)
    setTotalJobs(0)
    setCurrentJobStatus('')
  }

  const selectedCount = caseIdeas.filter(i => i.selected && !i.generated).length
  const generatedCount = caseIdeas.filter(i => i.generated).length

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-100 text-emerald-700'
      case 'intermediate': return 'bg-amber-100 text-amber-700'
      case 'advanced': return 'bg-red-100 text-red-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-slate-900">Bulk Add Cases</h1>
        <p className="mt-1 text-slate-600">
          Let AI research and suggest the best case studies based on your criteria
        </p>
      </div>

      {/* Active Generation Queue */}
      <div className="mb-8">
        <CaseGenerationQueue compact showCompleted={false} />
      </div>

      {/* Search Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
        <h2 className="font-serif text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-slate-400" />
          Research Criteria
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <Building2 className="h-4 w-4 inline mr-1" />
              Company
            </label>
            <Input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Apple, Netflix..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <BookOpen className="h-4 w-4 inline mr-1" />
              Concept
            </label>
            <Select
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              options={[
                { value: '', label: 'Any Concept' },
                ...concepts.map(c => ({ value: c.name, label: `${c.name} (${c.category})` }))
              ]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <Briefcase className="h-4 w-4 inline mr-1" />
              Career Path
            </label>
            <Select
              value={path}
              onChange={(e) => setPath(e.target.value)}
              options={PATHS}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <Calendar className="h-4 w-4 inline mr-1" />
              Year
            </label>
            <Select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              options={YEARS}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Provide at least one filter to search for case ideas
          </p>
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            variant="primary"
            className="gap-2"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Researching...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Find Case Ideas
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2 mb-6">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Case Ideas Results */}
      {caseIdeas.length > 0 && (
        <div className="space-y-6">
          {/* Actions Bar */}
          <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">
                {selectedCount} of {caseIdeas.length - generatedCount} cases selected
              </span>
              <button
                onClick={selectAll}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                Select All
              </button>
              <button
                onClick={deselectAll}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Deselect All
              </button>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleSearch}
                disabled={isSearching}
                className="gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant="primary"
                onClick={handleGenerateSelected}
                disabled={selectedCount === 0 || isGenerating}
                className="gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing {currentJobIndex} of {totalJobs}...
                  </>
                ) : (
                  <>
                    Generate {selectedCount} Case{selectedCount !== 1 ? 's' : ''}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-indigo-900">
                  Generating case {currentJobIndex} of {totalJobs}
                </span>
                <span className="text-xs text-indigo-600">
                  {Math.round((currentJobIndex / totalJobs) * 100)}%
                </span>
              </div>
              <div className="w-full bg-indigo-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(currentJobIndex / totalJobs) * 100}%` }}
                />
              </div>
              <p className="text-xs text-indigo-700 flex items-center gap-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                {currentJobStatus || 'Processing...'}
              </p>
              <p className="text-xs text-indigo-500 mt-2">
                Cases are processed one at a time to avoid rate limits. Please wait...
              </p>
            </div>
          )}

          {/* Case Ideas Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {caseIdeas.map((idea, index) => (
              <CaseIdeaCard
                key={index}
                idea={idea}
                onToggle={() => toggleCaseSelection(index)}
                difficultyColor={getDifficultyColor(idea.difficulty)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isSearching && caseIdeas.length === 0 && (
        <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-xl border border-slate-200">
          <Sparkles className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
          <h3 className="font-serif text-xl font-semibold text-slate-900 mb-2">
            Ready to Research
          </h3>
          <p className="text-slate-600 max-w-md mx-auto">
            Enter your criteria above and let AI find the best case study ideas 
            based on real business events and companies.
          </p>
        </div>
      )}
    </div>
  )
}

// Case Idea Card Component
function CaseIdeaCard({ 
  idea, 
  onToggle, 
  difficultyColor 
}: { 
  idea: CaseIdea
  onToggle: () => void
  difficultyColor: string
}) {
  const router = useRouter()
  const isDisabled = idea.generating
  const canNavigate = idea.generated && idea.caseSlug

  const handleClick = () => {
    if (canNavigate) {
      // Navigate to the case view
      router.push(`/cases/${idea.caseSlug}`)
    } else if (!isDisabled && !idea.generated) {
      onToggle()
    }
  }

  return (
    <div 
      className={`
        bg-white rounded-xl border p-5 transition-all cursor-pointer
        ${idea.selected && !isDisabled && !idea.generated ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-200'}
        ${idea.generated ? 'border-emerald-200 bg-emerald-50/30' : ''}
        ${isDisabled ? 'cursor-not-allowed' : 'hover:shadow-md'}
        ${canNavigate ? 'hover:border-emerald-400 hover:shadow-lg' : ''}
      `}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {idea.generated ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          ) : idea.generating ? (
            <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
          ) : (
            <div className={`
              h-5 w-5 rounded-full border-2 flex items-center justify-center
              ${idea.selected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'}
            `}>
              {idea.selected && <CheckCircle2 className="h-3 w-3 text-white" />}
            </div>
          )}
          <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColor}`}>
            {idea.difficulty}
          </span>
        </div>
        <span className="text-xs text-slate-500">{idea.year}</span>
      </div>

      <h3 className="font-serif font-semibold text-slate-900 mb-1 line-clamp-2">
        {idea.title}
      </h3>
      
      <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
        <span>{idea.company}</span>
        <span className="text-slate-300">•</span>
        <span>{idea.industry}</span>
      </div>

      <p className="text-sm text-slate-600 mb-3 line-clamp-2">
        {idea.description}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {idea.concepts.slice(0, 3).map((concept, i) => (
          <span
            key={i}
            className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600"
          >
            {concept}
          </span>
        ))}
        {idea.concepts.length > 3 && (
          <span className="text-xs text-slate-400">
            +{idea.concepts.length - 3}
          </span>
        )}
      </div>

      {idea.generated && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          {idea.caseSlug ? (
            <span className="text-xs text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Case created successfully
              <ExternalLink className="h-3 w-3 ml-1" />
              <span className="text-emerald-500">Click to view</span>
            </span>
          ) : (
            <span className="text-xs text-amber-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Generation attempted — Check job queue for status
            </span>
          )}
        </div>
      )}
    </div>
  )
}

