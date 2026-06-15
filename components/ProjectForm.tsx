'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  open: boolean
  plan?: string
  onClose: () => void
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function ProjectForm({ open, plan, onClose }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const t = setTimeout(() => nameRef.current?.focus(), 80)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
      clearTimeout(t)
    }
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      setStatus('idle')
      setError(null)
    }
  }, [open, plan])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const payload = {
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      project: String(fd.get('project') || ''),
      brief: String(fd.get('brief') || ''),
      plan: plan || '',
    }
    setStatus('submitting')
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-[60] flex items-end md:items-center justify-center px-4 md:px-6 py-4 md:py-6 transition-opacity duration-300 ${
        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/60 backdrop-blur-md"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Start a project"
        className={`relative w-full max-w-2xl max-h-[calc(100dvh-2rem)] md:max-h-[calc(100dvh-3rem)] overflow-hidden flex flex-col rounded-2xl bg-white text-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)] transition-all duration-300 ${
          open ? 'translate-y-0 scale-100' : 'translate-y-6 scale-[0.98]'
        }`}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-5 right-5 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-white hover:bg-ink hover:text-paper transition-colors"
        >
          <svg viewBox="0 0 10 10" className="h-3 w-3" fill="none">
            <path
              d="M2 2 L8 8 M8 2 L2 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="overflow-y-auto px-6 md:px-12 py-8 md:py-14">
          {/* Form view */}
          <div
            className={status === 'success' ? 'hidden' : 'block'}
            aria-hidden={status === 'success'}
          >
            <div className="flex items-center gap-3 mb-6 pr-12">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-ink/55">
                <span className="block w-6 h-px bg-ink/40" />
                Start a project
              </div>
              {plan && (
                <div className="inline-flex items-center gap-2 text-xs rounded-full border border-ink/15 pl-2 pr-3 py-1">
                  <span className="block h-1.5 w-1.5 rounded-full bg-ink" />
                  <span className="uppercase tracking-[0.2em] text-ink/55">
                    Plan
                  </span>
                  <span className="text-ink">{plan}</span>
                </div>
              )}
            </div>

            <h3 className="font-display text-3xl md:text-4xl tracking-tightest leading-[1.05] mb-8">
              Tell us a bit about what you'd like to build.
            </h3>

            <form onSubmit={onSubmit} className="grid gap-6 mt-2">
              <Field label="Your name" name="name" inputRef={nameRef} required />
              <Field label="Email" name="email" type="email" required />
              <Field
                label="Company or project name"
                name="project"
                hint="Optional"
              />
              <Field
                label="Tell us about the project"
                name="brief"
                textarea
                required
                hint="Timelines, goals, links to anything relevant."
                hintClassName="hidden md:inline"
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4 mt-2">
                <span className="text-xs text-ink/50">
                  We reply within two working days.
                </span>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex items-center justify-between gap-3 rounded-full bg-ink text-paper px-6 py-3 text-sm hover:bg-ink/90 transition-colors disabled:opacity-80 disabled:cursor-not-allowed"
                >
                  <span className="inline-flex items-center gap-2">
                    {status === 'submitting' && (
                      <svg
                        viewBox="0 0 20 20"
                        className="h-3.5 w-3.5 animate-spin"
                        fill="none"
                      >
                        <circle
                          cx="10"
                          cy="10"
                          r="8"
                          stroke="currentColor"
                          strokeWidth="2"
                          opacity="0.25"
                        />
                        <path
                          d="M18 10 A 8 8 0 0 0 10 2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                    )}
                    <span>
                      {status === 'submitting' ? 'Sending…' : 'Send brief'}
                    </span>
                  </span>
                  <span>→</span>
                </button>
              </div>
            </form>
          </div>

          {/* Success view */}
          {status === 'success' && (
            <div
              key="success"
              className="flex flex-col items-start animate-[check-pop_0.55s_cubic-bezier(0.2,0.8,0.2,1)_forwards]"
            >
              <div className="flex items-center gap-3 mb-8 text-xs uppercase tracking-[0.25em] text-ink/55">
                <span className="block w-6 h-px bg-ink/40" />
                Sent
              </div>

              <div className="mb-8 success-pop">
                <svg
                  viewBox="0 0 100 100"
                  className="h-16 w-16 text-ink"
                  fill="none"
                >
                  <circle
                    className="success-circle"
                    cx="50"
                    cy="50"
                    r="46"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    className="success-check"
                    d="M30 52 L46 67 L72 38"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h3 className="font-display text-3xl md:text-4xl tracking-tightest leading-[1.05] mb-4">
                Thanks, we'll be in touch.
              </h3>
              <p className="text-ink/65 leading-relaxed max-w-md">
                We've sent a copy of your brief to your inbox and will reply
                within two working days. In the meantime, feel free to email us
                directly at{' '}
                <a
                  href="mailto:hello@luciddesigns.com.au"
                  className="underline underline-offset-4"
                >
                  hello@luciddesigns.com.au
                </a>
                .
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-10 inline-flex items-center gap-2 text-sm border border-ink rounded-full px-5 py-3 hover:bg-ink hover:text-paper transition-colors"
              >
                <span>Close</span>
                <span>→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

type FieldProps = {
  label: string
  name: string
  type?: string
  textarea?: boolean
  required?: boolean
  hint?: string
  hintClassName?: string
  inputRef?: React.Ref<HTMLInputElement>
}

function Field({
  label,
  name,
  type = 'text',
  textarea,
  required,
  hint,
  hintClassName = '',
  inputRef,
}: FieldProps) {
  const base =
    'block w-full bg-transparent border-b border-ink/15 py-3 text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink transition-colors'
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs uppercase tracking-[0.2em] text-ink/55">
          {label}
          {required && <span className="text-ink/30"> *</span>}
        </span>
        {hint && (
          <span className={`text-[10px] text-ink/40 ${hintClassName}`}>
            {hint}
          </span>
        )}
      </div>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={4}
          className={`${base} resize-y leading-relaxed`}
        />
      ) : (
        <input
          ref={inputRef}
          name={name}
          type={type}
          required={required}
          className={base}
        />
      )}
    </label>
  )
}
