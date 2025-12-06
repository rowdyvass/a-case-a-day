'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Textarea, Badge, Select } from '@/components/ui'
import { 
  Save, 
  Eye, 
  Send, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  GripVertical,
  ChevronDown,
  ChevronRight,
  Newspaper,
  Library,
  Calendar,
  Image,
  RefreshCw
} from 'lucide-react'

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

interface Section {
  title: string
  content: string
}

interface Exhibit {
  id: string
  type: string
  title: string
  data: Record<string, unknown>
  order: number
}

interface Question {
  id: string
  text: string
  difficulty: string
  order: number
}

interface Concept {
  id: string
  name: string
  category: string
}

interface CaseData {
  id: string
  slug: string
  title: string
  company: string
  industry: string
  summary: string
  content: Section[]
  status: string
  exhibits: Exhibit[]
  questions: Question[]
  concepts: { concept: Concept }[]
  // Category fields
  category: string
  publishedDate: Date | string | null
  track: string | null
  skill: string | null
  difficulty: string
  // Illustration
  featuredImage: string | null
}

interface CaseEditorProps {
  caseData: CaseData
  allConcepts: Concept[]
}

export function CaseEditor({ caseData, allConcepts }: CaseEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(caseData.title)
  const [company, setCompany] = useState(caseData.company)
  const [industry, setIndustry] = useState(caseData.industry)
  const [summary, setSummary] = useState(caseData.summary)
  const [sections, setSections] = useState<Section[]>(Array.isArray(caseData.content) ? caseData.content : [])
  const [exhibits, setExhibits] = useState(Array.isArray(caseData.exhibits) ? caseData.exhibits : [])
  const [questions, setQuestions] = useState(Array.isArray(caseData.questions) ? caseData.questions : [])
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>(
    Array.isArray(caseData.concepts) ? caseData.concepts.map(c => c.concept.id) : []
  )
  const [status, setStatus] = useState(caseData.status)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'exhibits' | 'questions'>('content')
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]))
  
  // Category fields
  const [category, setCategory] = useState(caseData.category || 'daily')
  const [publishedDate, setPublishedDate] = useState(() => {
    if (!caseData.publishedDate) return ''
    const date = caseData.publishedDate instanceof Date 
      ? caseData.publishedDate 
      : new Date(caseData.publishedDate)
    return date.toISOString().split('T')[0]
  })
  const [track, setTrack] = useState(caseData.track || '')
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    caseData.skill ? caseData.skill.split(', ').filter(Boolean) : []
  )
  const [difficulty, setDifficulty] = useState(caseData.difficulty || 'intermediate')
  
  // Illustration state
  const [featuredImage, setFeaturedImage] = useState(caseData.featuredImage)
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false)

  const handleRegenerateIllustration = async () => {
    setIsRegeneratingImage(true)
    try {
      const response = await fetch(`/api/cases/${caseData.id}/illustration`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to regenerate illustration')
      }
      
      const data = await response.json()
      if (data.imagePath) {
        setFeaturedImage(data.imagePath)
      }
      router.refresh()
    } catch (error) {
      console.error('Regenerate illustration error:', error)
      alert(error instanceof Error ? error.message : 'Failed to regenerate illustration')
    } finally {
      setIsRegeneratingImage(false)
    }
  }

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedSections(newExpanded)
  }

  const updateSection = (index: number, field: 'title' | 'content', value: string) => {
    const newSections = [...sections]
    newSections[index] = { ...newSections[index], [field]: value }
    setSections(newSections)
  }

  const addSection = () => {
    setSections([...sections, { title: 'New Section', content: '' }])
    setExpandedSections(new Set([...expandedSections, sections.length]))
  }

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, field: 'text' | 'difficulty', value: string) => {
    const newQuestions = [...questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setQuestions(newQuestions)
  }

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { id: `new-${Date.now()}`, text: '', difficulty: 'medium', order: questions.length }
    ])
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleSave = async (newStatus?: string) => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/cases/${caseData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          company,
          industry,
          summary,
          content: sections,
          exhibits,
          questions,
          conceptIds: selectedConcepts,
          status: newStatus || status,
          // Category fields
          category,
          publishedDate: category === 'daily' && publishedDate ? publishedDate : null,
          track: category === 'canonical' ? track : null,
          skill: category === 'canonical' ? selectedSkills.join(', ') : null,
          difficulty,
        })
      })

      if (!response.ok) throw new Error('Failed to save case')

      if (newStatus) setStatus(newStatus)
      router.refresh()
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save case')
    } finally {
      setIsSaving(false)
    }
  }

  const conceptsByCategory = allConcepts.reduce((acc, concept) => {
    if (!acc[concept.category]) acc[concept.category] = []
    acc[concept.category].push(concept)
    return acc
  }, {} as Record<string, Concept[]>)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/operator/cases')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-xl font-semibold text-slate-900 truncate max-w-md">
                    {title || 'Untitled Case'}
                  </h1>
                  <StatusBadge status={status} />
                </div>
                <p className="text-sm text-slate-500">{company} • {industry}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {status === 'published' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`/cases/${caseData.slug}`, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave()}
                isLoading={isSaving}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              {status === 'draft' && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSave('review')}
                >
                  Submit for Review
                </Button>
              )}
              {status === 'review' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSave('published')}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Publish
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
              {(['content', 'exhibits', 'questions'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                  <Input
                    label="Case Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="font-serif text-lg"
                  />
                  <Textarea
                    label="Executive Summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="mt-4"
                  />
                </div>

                {sections.map((section, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                  >
                    <div
                      className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200 cursor-pointer"
                      onClick={() => toggleSection(index)}
                    >
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-slate-400" />
                        {expandedSections.has(index) ? (
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-400" />
                        )}
                        <span className="font-medium text-slate-700">
                          {section.title || `Section ${index + 1}`}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeSection(index)
                        }}
                        className="h-8 w-8 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {expandedSections.has(index) && (
                      <div className="p-4 space-y-4">
                        <Input
                          label="Section Title"
                          value={section.title}
                          onChange={(e) => updateSection(index, 'title', e.target.value)}
                        />
                        <Textarea
                          label="Content"
                          value={section.content}
                          onChange={(e) => updateSection(index, 'content', e.target.value)}
                          className="min-h-[200px]"
                        />
                      </div>
                    )}
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addSection}
                  className="w-full gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Section
                </Button>
              </div>
            )}

            {/* Exhibits Tab */}
            {activeTab === 'exhibits' && (
              <div className="space-y-4">
                {exhibits.map((exhibit, index) => (
                  <div
                    key={exhibit.id}
                    className="bg-white rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge>{exhibit.type}</Badge>
                        <span className="font-medium text-slate-700">{exhibit.title}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setExhibits(exhibits.filter((_, i) => i !== index))}
                        className="h-8 w-8 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <pre className="bg-slate-50 p-3 rounded-lg text-xs overflow-auto max-h-40">
                      {JSON.stringify(exhibit.data, null, 2)}
                    </pre>
                  </div>
                ))}

                {exhibits.length === 0 && (
                  <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center">
                    <p className="text-slate-500">No exhibits yet. They were generated automatically.</p>
                  </div>
                )}
              </div>
            )}

            {/* Questions Tab */}
            {activeTab === 'questions' && (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="bg-white rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </span>
                      <div className="flex-1 space-y-3">
                        <Textarea
                          value={question.text}
                          onChange={(e) => updateQuestion(index, 'text', e.target.value)}
                          className="min-h-[80px]"
                        />
                        <div className="flex items-center justify-between">
                          <Select
                            value={question.difficulty}
                            onChange={(e) => updateQuestion(index, 'difficulty', e.target.value)}
                            options={[
                              { value: 'easy', label: 'Easy' },
                              { value: 'medium', label: 'Medium' },
                              { value: 'hard', label: 'Hard' }
                            ]}
                            className="w-32"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(index)}
                            className="text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={addQuestion}
                  className="w-full gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Question
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Illustration */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Image className="h-4 w-4" />
                Featured Illustration
              </h3>
              
              {featuredImage ? (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                    <img 
                      src={featuredImage} 
                      alt="Case illustration"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerateIllustration}
                    isLoading={isRegeneratingImage}
                    className="w-full gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Regenerate Illustration
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="aspect-video rounded-lg bg-slate-100 flex items-center justify-center">
                    <div className="text-center text-slate-400">
                      <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No illustration yet</p>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleRegenerateIllustration}
                    isLoading={isRegeneratingImage}
                    className="w-full gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Generate Illustration
                  </Button>
                </div>
              )}
            </div>

            {/* Case Category */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Case Category</h3>
              
              {/* Category Toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setCategory('daily')}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors text-sm ${
                    category === 'daily'
                      ? 'border-amber-500 bg-amber-50 text-amber-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Newspaper className="h-4 w-4" />
                  Daily
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('canonical')}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors text-sm ${
                    category === 'canonical'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Library className="h-4 w-4" />
                  Canonical
                </button>
              </div>

              {/* Daily Case Fields */}
              {category === 'daily' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <Calendar className="h-3.5 w-3.5 inline mr-1" />
                    Featured Date
                  </label>
                  <input
                    type="date"
                    value={publishedDate}
                    onChange={(e) => setPublishedDate(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-300 bg-white text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-colors"
                  />
                </div>
              )}

              {/* Canonical Case Fields */}
              {category === 'canonical' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Track</label>
                    <Select
                      value={track}
                      onChange={(e) => setTrack(e.target.value)}
                      options={TRACK_OPTIONS}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
                    <Select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      options={DIFFICULTY_OPTIONS}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Skills</label>
                    <div className="flex flex-wrap gap-1">
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
                          className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
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

            {/* Case Details */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Case Details</h3>
              <div className="space-y-4">
                <Input
                  label="Company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
                <Input
                  label="Industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
            </div>

            {/* Concepts */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-900 mb-4">MBA Concepts</h3>
              <div className="space-y-4">
                {Object.entries(conceptsByCategory).map(([category, concepts]) => (
                  <div key={category}>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                      {category}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {concepts.map((concept) => (
                        <button
                          key={concept.id}
                          onClick={() => {
                            setSelectedConcepts((prev) =>
                              prev.includes(concept.id)
                                ? prev.filter((id) => id !== concept.id)
                                : [...prev, concept.id]
                            )
                          }}
                          className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                            selectedConcepts.includes(concept.id)
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {concept.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    review: 'bg-yellow-100 text-yellow-700',
    published: 'bg-emerald-100 text-emerald-700'
  }

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

