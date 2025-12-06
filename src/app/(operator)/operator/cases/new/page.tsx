'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Textarea, Select } from '@/components/ui'
import { 
  ArrowRight, 
  Link as LinkIcon, 
  FileText, 
  Upload, 
  Loader2, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building2,
  Briefcase,
  BookOpen,
  Plus,
  X,
  Calendar,
  Newspaper,
  Library
} from 'lucide-react'

type InputMethod = 'url' | 'text' | 'file'
type CaseCategory = 'daily' | 'canonical'

// Track options for canonical cases
const TRACK_OPTIONS = [
  { value: '', label: 'Select Track' },
  { value: 'Core', label: 'Core' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Strategy', label: 'Strategy' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Leadership', label: 'Leadership' },
]

// Skill options for canonical cases
const SKILL_OPTIONS = [
  'Quantitative Analysis',
  'Strategic Thinking',
  'Communication',
  'Leadership',
  'Problem Solving',
  'Financial Modeling',
  'Market Analysis',
  'Decision Making',
]

// Difficulty options
const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

interface AnalysisResult {
  company: string
  industry: string
  recommendedConcepts: { name: string; relevance: string }[]
  learningObjectives: string[]
  summary: string
  confidence: {
    company: 'high' | 'medium' | 'low'
    industry: 'high' | 'medium' | 'low'
    concepts: 'high' | 'medium' | 'low'
  }
}

interface GenerationJob {
  id: string
  status: string
  progress: number
  currentStep: string
  company?: string
  caseId?: string
  errorMessage?: string
}

const GENERATION_STEPS = [
  { key: 'pending', label: 'Queued', progress: 0 },
  { key: 'extracting', label: 'Extracting content', progress: 5 },
  { key: 'analyzing', label: 'Analyzing article', progress: 15 },
  { key: 'researching', label: 'Researching company', progress: 30 },
  { key: 'generating_case', label: 'Writing case narrative', progress: 50 },
  { key: 'generating_exhibits', label: 'Creating exhibits', progress: 70 },
  { key: 'generating_questions', label: 'Generating questions', progress: 85 },
  { key: 'completed', label: 'Complete!', progress: 100 },
]

export default function NewCasePage() {
  const router = useRouter()
  const [inputMethod, setInputMethod] = useState<InputMethod>('url')
  const [url, setUrl] = useState('')
  const [articleText, setArticleText] = useState('')
  const [articleTitle, setArticleTitle] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [activeJobs, setActiveJobs] = useState<GenerationJob[]>([])
  
  // Category fields
  const [category, setCategory] = useState<CaseCategory>('daily')
  const [publishedDate, setPublishedDate] = useState<string>(
    new Date().toISOString().split('T')[0] // Default to today
  )
  const [track, setTrack] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState('intermediate')

  // Poll for job updates
  const pollJobs = useCallback(async () => {
    try {
      const response = await fetch('/api/cases/jobs')
      if (response.ok) {
        const data = await response.json()
        setActiveJobs(data.jobs.filter((j: GenerationJob) => 
          ['pending', 'extracting', 'analyzing', 'researching', 'generating_case', 'generating_exhibits', 'generating_questions'].includes(j.status)
        ))
      }
    } catch (err) {
      console.error('Failed to poll jobs:', err)
    }
  }, [])

  useEffect(() => {
    pollJobs()
    const interval = setInterval(pollJobs, 2000)
    return () => clearInterval(interval)
  }, [pollJobs])

  const handleExtractUrl = async () => {
    if (!url) return
    setIsExtracting(true)
    setError('')
    setAnalysis(null)

    try {
      const response = await fetch('/api/extract-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })

      if (!response.ok) throw new Error('Failed to extract article')

      const data = await response.json()
      setArticleTitle(data.title || '')
      setArticleText(data.content || '')
      
      // Auto-analyze after extraction
      if (data.content && data.content.length > 100) {
        analyzeContent(data.content, data.title)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract article')
    } finally {
      setIsExtracting(false)
    }
  }

  const analyzeContent = async (content: string, title?: string) => {
    if (!content || content.length < 100) return
    
    setIsAnalyzing(true)
    setError('')

    try {
      const response = await fetch('/api/cases/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, title })
      })

      if (!response.ok) throw new Error('Failed to analyze content')

      const data = await response.json()
      setAnalysis(data)
    } catch (err) {
      console.error('Analysis error:', err)
      // Don't show error - analysis is optional
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleTextChange = (text: string) => {
    setArticleText(text)
    setAnalysis(null)
    
    // Debounced analysis
    if (text.length > 500) {
      const timeoutId = setTimeout(() => {
        analyzeContent(text, articleTitle)
      }, 1500)
      return () => clearTimeout(timeoutId)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!articleText) {
      setError('Please provide article content')
      return
    }

    setError('')

    try {
      // Create a job
      const jobResponse = await fetch('/api/cases/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceType: inputMethod,
          sourceUrl: inputMethod === 'url' ? url : undefined,
          sourceTitle: articleTitle,
          sourceContent: articleText,
          company: analysis?.company,
          industry: analysis?.industry,
          concepts: analysis?.recommendedConcepts.map(c => c.name),
          // Category metadata
          category,
          publishedDate: category === 'daily' ? publishedDate : undefined,
          track: category === 'canonical' ? track : undefined,
          skill: category === 'canonical' ? selectedSkills.join(', ') : undefined,
          difficulty,
        })
      })

      if (!jobResponse.ok) {
        const data = await jobResponse.json()
        throw new Error(data.error || 'Failed to create job')
      }

      const job = await jobResponse.json()
      
      // Start processing
      fetch(`/api/cases/jobs/${job.id}/process`, { method: 'POST' })
        .catch(console.error)

      // Reset form for another case
      setUrl('')
      setArticleText('')
      setArticleTitle('')
      setAnalysis(null)
      setCategory('daily')
      setPublishedDate(new Date().toISOString().split('T')[0])
      setTrack('')
      setSelectedSkills([])
      setDifficulty('intermediate')
      
      // Poll for updates
      pollJobs()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start generation')
    }
  }

  const handleCancelJob = async (jobId: string) => {
    try {
      await fetch('/api/cases/jobs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: jobId, action: 'cancel' })
      })
      pollJobs()
    } catch (err) {
      console.error('Failed to cancel job:', err)
    }
  }

  const getConfidenceBadge = (level: 'high' | 'medium' | 'low') => {
    const colors = {
      high: 'bg-emerald-100 text-emerald-700',
      medium: 'bg-amber-100 text-amber-700',
      low: 'bg-red-100 text-red-700'
    }
    return colors[level]
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-slate-900">Create New Case</h1>
        <p className="mt-1 text-slate-600">
          Just paste a link or article — we&apos;ll handle the rest
        </p>
      </div>

      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <div className="mb-8 space-y-3">
          <h2 className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating Cases ({activeJobs.length})
          </h2>
          {activeJobs.map((job) => (
            <JobProgressCard 
              key={job.id} 
              job={job} 
              onCancel={() => handleCancelJob(job.id)}
              onComplete={(caseId) => router.push(`/operator/cases/${caseId}/edit`)}
            />
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Method Selection */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-serif text-lg font-semibold text-slate-900 mb-4">
            Source Article
          </h2>
          
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setInputMethod('url')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                inputMethod === 'url'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <LinkIcon className="h-4 w-4" />
              URL
            </button>
            <button
              type="button"
              onClick={() => setInputMethod('text')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                inputMethod === 'text'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileText className="h-4 w-4" />
              Paste Text
            </button>
            <button
              type="button"
              onClick={() => setInputMethod('file')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                inputMethod === 'file'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Upload className="h-4 w-4" />
              Upload File
            </button>
          </div>

          {inputMethod === 'url' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  label="Article URL"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleExtractUrl}
                  disabled={!url || isExtracting}
                  className="mt-6"
                >
                  {isExtracting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Extract'
                  )}
                </Button>
              </div>
              {articleText && (
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-700 mb-2">{articleTitle}</p>
                  <p className="text-sm text-slate-600 line-clamp-4">{articleText}</p>
                </div>
              )}
            </div>
          )}

          {inputMethod === 'text' && (
            <div className="space-y-4">
              <Input
                label="Article Title (optional)"
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                placeholder="Enter the article title"
              />
              <Textarea
                label="Article Content"
                value={articleText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Paste the article content here..."
                className="min-h-[200px]"
              />
            </div>
          )}

          {inputMethod === 'file' && (
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 text-slate-400 mx-auto mb-4" />
              <p className="text-sm text-slate-600 mb-2">
                Drag and drop a PDF or document file, or click to browse
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                id="file-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (event) => {
                      const text = event.target?.result as string
                      setArticleText(text)
                      setArticleTitle(file.name.replace(/\.[^/.]+$/, ''))
                      analyzeContent(text, file.name)
                    }
                    reader.readAsText(file)
                  }
                }}
              />
              <label htmlFor="file-upload">
                <Button type="button" variant="outline" size="sm" className="cursor-pointer">
                  Choose File
                </Button>
              </label>
            </div>
          )}
        </div>

        {/* Case Category */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-serif text-lg font-semibold text-slate-900 mb-4">
            Case Category
          </h2>
          
          {/* Category Toggle */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => setCategory('daily')}
              className={`flex-1 flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                category === 'daily'
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`p-2 rounded-lg ${category === 'daily' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <Newspaper className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className={`font-medium ${category === 'daily' ? 'text-amber-900' : 'text-slate-700'}`}>
                  Daily Case
                </p>
                <p className="text-sm text-slate-500">
                  News-driven, timely content
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setCategory('canonical')}
              className={`flex-1 flex items-center gap-3 p-4 rounded-lg border-2 transition-colors ${
                category === 'canonical'
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`p-2 rounded-lg ${category === 'canonical' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <Library className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className={`font-medium ${category === 'canonical' ? 'text-indigo-900' : 'text-slate-700'}`}>
                  Canonical Case
                </p>
                <p className="text-sm text-slate-500">
                  Classic, comprehensive study
                </p>
              </div>
            </button>
          </div>

          {/* Daily Case Fields */}
          {category === 'daily' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Featured Date
                </label>
                <input
                  type="date"
                  value={publishedDate}
                  onChange={(e) => setPublishedDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-colors"
                />
                <p className="text-xs text-slate-500 mt-1">
                  The date this case will be featured as &quot;Today&apos;s Case&quot;
                </p>
              </div>
            </div>
          )}

          {/* Canonical Case Fields */}
          {category === 'canonical' && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Track
                  </label>
                  <Select
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    options={TRACK_OPTIONS}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Difficulty
                  </label>
                  <Select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    options={DIFFICULTY_OPTIONS}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Skills Covered
                </label>
                <div className="flex flex-wrap gap-2">
                  {SKILL_OPTIONS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => {
                        setSelectedSkills((prev) =>
                          prev.includes(skill)
                            ? prev.filter((s) => s !== skill)
                            : [...prev, skill]
                        )
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedSkills.includes(skill)
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Analysis Preview */}
        {(isAnalyzing || analysis) && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <h2 className="font-serif text-lg font-semibold text-slate-900">
                {isAnalyzing ? 'Analyzing...' : 'Auto-Detected'}
              </h2>
              {isAnalyzing && <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />}
            </div>

            {analysis && (
              <div className="space-y-4">
                {/* Company & Industry */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 bg-white rounded-lg p-3">
                    <Building2 className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Company</p>
                      <p className="font-medium text-slate-900">{analysis.company}</p>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${getConfidenceBadge(analysis.confidence.company)}`}>
                        {analysis.confidence.company} confidence
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-white rounded-lg p-3">
                    <Briefcase className="h-5 w-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Industry</p>
                      <p className="font-medium text-slate-900">{analysis.industry}</p>
                      <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${getConfidenceBadge(analysis.confidence.industry)}`}>
                        {analysis.confidence.industry} confidence
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommended Concepts */}
                <div className="bg-white rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    <p className="text-xs text-slate-500">Recommended Concepts</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.recommendedConcepts.map((concept, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700"
                        title={concept.relevance}
                      >
                        {concept.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Summary</p>
                  <p className="text-sm text-slate-700">{analysis.summary}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <div className="flex gap-3">
            <Button
              type="submit"
              variant="primary"
              className="gap-2"
              disabled={!articleText || isAnalyzing}
            >
              <Plus className="h-4 w-4" />
              Generate Case
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

// Job Progress Card Component
function JobProgressCard({ 
  job, 
  onCancel,
  onComplete 
}: { 
  job: GenerationJob
  onCancel: () => void
  onComplete: (caseId: string) => void
}) {
  const currentStepIndex = GENERATION_STEPS.findIndex(s => s.key === job.status)
  const progressPercent = job.progress || GENERATION_STEPS[currentStepIndex]?.progress || 0

  useEffect(() => {
    if (job.status === 'completed' && job.caseId) {
      onComplete(job.caseId)
    }
  }, [job.status, job.caseId, onComplete])

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {job.status === 'completed' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          ) : job.status === 'failed' ? (
            <AlertCircle className="h-4 w-4 text-red-500" />
          ) : (
            <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
          )}
          <span className="font-medium text-slate-900">
            {job.company || 'Processing...'}
          </span>
        </div>
        {['pending', 'extracting', 'analyzing', 'researching', 'generating_case', 'generating_exhibits', 'generating_questions'].includes(job.status) && (
          <button
            onClick={onCancel}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
            title="Cancel"
          >
            <X className="h-4 w-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Status */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">{job.currentStep || 'Starting...'}</span>
        <span className="text-slate-400">{progressPercent}%</span>
      </div>

      {job.errorMessage && (
        <p className="mt-2 text-sm text-red-600">{job.errorMessage}</p>
      )}
    </div>
  )
}
