'use client'

import { useState, useEffect } from 'react'
import { Button, Card, Badge, Modal, Input, Select } from '@/components/ui'
import { 
  Plus, 
  Check, 
  X, 
  Edit3, 
  Trash2, 
  ChevronDown, 
  ChevronRight,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react'

// Prompt types
const PROMPT_TYPES = [
  { id: 'analyze', name: 'Content Analysis', description: 'Auto-detects company, industry, concepts' },
  { id: 'research', name: 'Company Research', description: 'Gathers company and market data' },
  { id: 'protagonist', name: 'Protagonist Generation', description: 'Creates fictional case protagonist' },
  { id: 'case', name: 'Case Narrative', description: 'Generates the main case content' },
  { id: 'exhibits', name: 'Exhibit Generation', description: 'Creates charts, tables, and visualizations' },
  { id: 'questions', name: 'Question Generation', description: 'Creates interactive assessment questions' },
  { id: 'validation', name: 'Validation', description: 'Fact-checks generated content' },
  { id: 'grading', name: 'Case Grading', description: 'Evaluates overall case quality' },
  { id: 'sufficiency', name: 'Research Sufficiency', description: 'Checks if enough data for case' },
  { id: 'enrichment', name: 'Enrichment Synthesis', description: 'Processes web research results' },
  { id: 'entity_extraction', name: 'Entity Extraction', description: 'Extracts searchable entities from articles' },
]

interface PromptVersion {
  id: string
  promptType: string
  version: string
  name: string | null
  content: string
  systemPrompt: string | null
  isActive: boolean
  description: string | null
  createdAt: string
  createdBy: string | null
}

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Record<string, PromptVersion[]>>({})
  const [loading, setLoading] = useState(true)
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set())
  const [selectedPrompt, setSelectedPrompt] = useState<PromptVersion | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newPromptType, setNewPromptType] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editSystemPrompt, setEditSystemPrompt] = useState('')
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPrompts()
  }, [])

  const fetchPrompts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/prompts')
      const data = await res.json()
      setPrompts(data.grouped || {})
    } catch (err) {
      console.error('Failed to fetch prompts:', err)
      setError('Failed to load prompts')
    } finally {
      setLoading(false)
    }
  }

  const toggleType = (type: string) => {
    const newExpanded = new Set(expandedTypes)
    if (newExpanded.has(type)) {
      newExpanded.delete(type)
    } else {
      newExpanded.add(type)
    }
    setExpandedTypes(newExpanded)
  }

  const handleActivate = async (prompt: PromptVersion) => {
    try {
      setSaving(true)
      const res = await fetch(`/api/prompts/${prompt.id}/activate`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to activate')
      await fetchPrompts()
    } catch (err) {
      console.error('Failed to activate prompt:', err)
      setError('Failed to activate prompt')
    } finally {
      setSaving(false)
    }
  }

  const handleDeactivate = async (prompt: PromptVersion) => {
    try {
      setSaving(true)
      const res = await fetch(`/api/prompts/${prompt.id}/activate`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to deactivate')
      await fetchPrompts()
    } catch (err) {
      console.error('Failed to deactivate prompt:', err)
      setError('Failed to deactivate prompt')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (prompt: PromptVersion) => {
    if (!confirm('Are you sure you want to delete this prompt version?')) return
    
    try {
      setSaving(true)
      const res = await fetch(`/api/prompts/${prompt.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete')
      }
      await fetchPrompts()
      setSelectedPrompt(null)
    } catch (err) {
      console.error('Failed to delete prompt:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete prompt')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (prompt: PromptVersion) => {
    setSelectedPrompt(prompt)
    setEditContent(prompt.content)
    setEditSystemPrompt(prompt.systemPrompt || '')
    setEditName(prompt.name || '')
    setEditDescription(prompt.description || '')
    setIsEditing(true)
  }

  const handleCreate = (type: string) => {
    setNewPromptType(type)
    setEditContent('')
    setEditSystemPrompt('')
    setEditName('')
    setEditDescription('')
    setIsCreating(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedPrompt) return
    
    try {
      setSaving(true)
      const res = await fetch(`/api/prompts/${selectedPrompt.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editContent,
          systemPrompt: editSystemPrompt,
          name: editName,
          description: editDescription,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save')
      }
      await fetchPrompts()
      setIsEditing(false)
      setSelectedPrompt(null)
    } catch (err) {
      console.error('Failed to save prompt:', err)
      setError(err instanceof Error ? err.message : 'Failed to save prompt')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveCreate = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptType: newPromptType,
          content: editContent,
          systemPrompt: editSystemPrompt,
          name: editName,
          description: editDescription,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create')
      }
      await fetchPrompts()
      setIsCreating(false)
      // Expand the type to show the new prompt
      setExpandedTypes(new Set([...expandedTypes, newPromptType]))
    } catch (err) {
      console.error('Failed to create prompt:', err)
      setError(err instanceof Error ? err.message : 'Failed to create prompt')
    } finally {
      setSaving(false)
    }
  }

  const getActivePrompt = (type: string): PromptVersion | undefined => {
    return prompts[type]?.find(p => p.isActive)
  }

  if (loading) {
    return (
      <div className="pt-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-48"></div>
            <div className="h-4 bg-slate-200 rounded w-96"></div>
            <div className="space-y-3 mt-8">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-20 bg-slate-100 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 px-8 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">
            Prompt Registry
          </h1>
          <p className="text-slate-600">
            Manage and version AI prompts used for case generation. Track which prompts produce the best results.
          </p>
        </div>

        {/* Error Toast */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Prompt Types List */}
        <div className="space-y-3">
          {PROMPT_TYPES.map(type => {
            const versions = prompts[type.id] || []
            const activePrompt = getActivePrompt(type.id)
            const isExpanded = expandedTypes.has(type.id)

            return (
              <Card key={type.id} className="overflow-hidden">
                {/* Type Header */}
                <button
                  onClick={() => toggleType(type.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    )}
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{type.name}</span>
                        <Badge variant={activePrompt ? 'default' : 'secondary'}>
                          {activePrompt ? `v${activePrompt.version}` : 'No active version'}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500">{type.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">{versions.length} version(s)</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCreate(type.id)
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </button>

                {/* Versions List */}
                {isExpanded && versions.length > 0 && (
                  <div className="border-t border-slate-100">
                    {versions.map(prompt => (
                      <div
                        key={prompt.id}
                        className={`p-4 pl-12 border-b border-slate-50 last:border-b-0 flex items-center justify-between ${
                          prompt.isActive ? 'bg-green-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {prompt.isActive && (
                            <Sparkles className="h-4 w-4 text-green-600" />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-700">
                                {prompt.name || `v${prompt.version}`}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                v{prompt.version}
                              </Badge>
                              {prompt.isActive && (
                                <Badge className="bg-green-100 text-green-700">Active</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                              <Clock className="h-3 w-3" />
                              {new Date(prompt.createdAt).toLocaleDateString()}
                              {prompt.description && (
                                <span className="text-slate-500">- {prompt.description}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {!prompt.isActive && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleActivate(prompt)}
                              disabled={saving}
                              title="Activate this version"
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          {prompt.isActive && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeactivate(prompt)}
                              disabled={saving}
                              title="Deactivate this version"
                            >
                              <X className="h-4 w-4 text-orange-500" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(prompt)}
                            disabled={prompt.isActive}
                            title={prompt.isActive ? 'Cannot edit active prompt' : 'Edit'}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(prompt)}
                            disabled={prompt.isActive || saving}
                            title={prompt.isActive ? 'Cannot delete active prompt' : 'Delete'}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {isExpanded && versions.length === 0 && (
                  <div className="border-t border-slate-100 p-8 text-center">
                    <p className="text-slate-500 mb-4">No prompt versions yet</p>
                    <Button onClick={() => handleCreate(type.id)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Version
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>

        {/* Edit Modal */}
        <Modal
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          title={`Edit Prompt: ${selectedPrompt?.name || selectedPrompt?.version}`}
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Name
              </label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Version name..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <Input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="What changed in this version..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                System Prompt
              </label>
              <textarea
                value={editSystemPrompt}
                onChange={(e) => setEditSystemPrompt(e.target.value)}
                className="w-full h-48 px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm resize-y"
                placeholder="System prompt..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                User Prompt Template
              </label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-64 px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm resize-y"
                placeholder="User prompt template..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </Modal>

        {/* Create Modal */}
        <Modal
          isOpen={isCreating}
          onClose={() => setIsCreating(false)}
          title={`Create New Version: ${PROMPT_TYPES.find(t => t.id === newPromptType)?.name}`}
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Name
              </label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Version name..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <Input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="What's different about this version..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                System Prompt
              </label>
              <textarea
                value={editSystemPrompt}
                onChange={(e) => setEditSystemPrompt(e.target.value)}
                className="w-full h-48 px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm resize-y"
                placeholder="System prompt..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                User Prompt Template
              </label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-64 px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm resize-y"
                placeholder="User prompt template..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="ghost" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCreate} disabled={saving || !editContent}>
                {saving ? 'Creating...' : 'Create Version'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

