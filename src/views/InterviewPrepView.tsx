import { useState } from 'react'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '../components/common/PageHeader'
import { SourceBadge } from '../components/common/SourceBadge'
import { interviewQuestions } from '../content/interviewQuestions'
import { useStore } from '../state/store'

function TechQuestion({ q }: { q: (typeof interviewQuestions)[number] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)]">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left" aria-expanded={open}>
        <span className="text-sm font-medium">{q.question}</span>
        <ChevronDown size={16} className={`shrink-0 text-[color:var(--text-faint)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="space-y-3 border-t border-[color:var(--border)] px-4 py-3 text-sm">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">Key concepts the interviewer wants to hear</p>
            <div className="flex flex-wrap gap-1.5">
              {q.keyConcepts.map((k) => (
                <span key={k} className="rounded-full bg-[color:var(--bg-sunken)] px-2 py-0.5 text-xs">
                  {k}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">Strong-answer outline</p>
            <ul className="list-disc space-y-1 pl-4">
              {q.strongAnswerOutline.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">Common incorrect assumptions</p>
            <ul className="list-disc space-y-1 pl-4 text-[color:var(--text-muted)]">
              {q.commonMisconceptions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <SourceBadge sourceIds={q.sourceIds} compact />
        </div>
      )}
    </div>
  )
}

function StarBuilder() {
  const stories = useStore((s) => s.starStories)
  const addStarStory = useStore((s) => s.addStarStory)
  const updateStarStory = useStore((s) => s.updateStarStory)
  const removeStarStory = useStore((s) => s.removeStarStory)

  return (
    <div>
      <p className="mb-4 text-sm text-[color:var(--text-muted)]">
        Build stories from your actual experience — operational planning, facilities readiness, accountability, cross-functional coordination, last-minute changes, risk management,
        stakeholder communication, business development. Nothing here is pre-written; every field is yours to enter.
      </p>
      <button
        type="button"
        onClick={() => addStarStory({ title: 'New story', situation: '', task: '', action: '', result: '', relevance: '' })}
        className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--accent)] px-3 py-1.5 text-xs font-semibold text-white"
      >
        <Plus size={14} /> Add story
      </button>
      <div className="space-y-4">
        {stories.map((story) => (
          <div key={story.id} className="rounded-lg border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <input
                value={story.title}
                onChange={(e) => updateStarStory(story.id, { title: e.target.value })}
                className="flex-1 rounded border border-transparent bg-transparent text-sm font-semibold hover:border-[color:var(--border)] focus-visible:border-[color:var(--accent)]"
                aria-label="Story title"
              />
              <button type="button" onClick={() => removeStarStory(story.id)} aria-label="Remove story" className="rounded p-1 text-domain-security hover:bg-domain-security/10">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(['situation', 'task', 'action', 'result', 'relevance'] as const).map((field) => (
                <label key={field} className={`block text-xs ${field === 'relevance' ? 'sm:col-span-2' : ''}`}>
                  <span className="mb-1 block font-semibold uppercase tracking-wide text-[color:var(--text-faint)]">
                    {field === 'relevance' ? 'Relevance to IT project coordination' : field}
                  </span>
                  <textarea
                    value={story[field]}
                    onChange={(e) => updateStarStory(story.id, { [field]: e.target.value })}
                    rows={2}
                    className="w-full rounded-md border border-[color:var(--border)] bg-[color:var(--bg)] p-2 text-sm outline-none focus-visible:border-[color:var(--accent)]"
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
        {stories.length === 0 && <p className="text-sm text-[color:var(--text-faint)]">No stories yet — add one above.</p>}
      </div>
    </div>
  )
}

export function InterviewPrepView() {
  const [tab, setTab] = useState<'technical' | 'background'>('technical')
  return (
    <div>
      <PageHeader eyebrow="Two parts" title="Interview Prep" description="Technical language fluency, and your own background translated into IT-project-coordination terms." />
      <div className="p-4 sm:p-6">
        <div className="mb-4 flex gap-1.5">
          <button
            type="button"
            onClick={() => setTab('technical')}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${tab === 'technical' ? 'border-[color:var(--accent)] bg-[color:var(--accent)]/10 text-[color:var(--accent-strong)]' : 'border-[color:var(--border)] text-[color:var(--text-muted)]'}`}
          >
            Part A · Technical language
          </button>
          <button
            type="button"
            onClick={() => setTab('background')}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${tab === 'background' ? 'border-[color:var(--accent)] bg-[color:var(--accent)]/10 text-[color:var(--accent-strong)]' : 'border-[color:var(--border)] text-[color:var(--text-muted)]'}`}
          >
            Part B · Background translation (STAR)
          </button>
        </div>

        {tab === 'technical' ? (
          <div className="mx-auto max-w-2xl space-y-2">
            {interviewQuestions.map((q) => (
              <TechQuestion key={q.id} q={q} />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            <StarBuilder />
          </div>
        )}
      </div>
    </div>
  )
}
