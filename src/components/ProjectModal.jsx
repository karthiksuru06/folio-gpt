import { motion } from 'framer-motion'
import {
  X, Github, ExternalLink, Target, Lightbulb, Layers, TrendingUp,
  Copy, Check, Network, ListChecks, Mountain,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

/** A titled block that renders nothing when it has no content. */
const Section = ({ icon: Icon, title, tint, children, show = true }) => {
  if (!show) return null
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${tint}1a`, border: `1px solid ${tint}4d` }}
        >
          <Icon className="w-5 h-5" style={{ color: tint }} aria-hidden="true" />
        </div>
        <h3 className="font-mono font-semibold text-ink text-lg">{title}</h3>
      </div>
      <div className="sm:ml-[52px]">{children}</div>
    </section>
  )
}

const ProjectModal = ({ project, onClose }) => {
  const [copied, setCopied] = useState(false)
  const panelRef = useRef(null)
  const closeRef = useRef(null)

  // Escape to close, focus moved into the dialog, and body scroll locked
  // while it's open. Without these the modal is unusable by keyboard.
  useEffect(() => {
    const FOCUSABLE =
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      // Trap Tab inside the dialog. Moving initial focus in is not enough —
      // without this, Shift+Tab from the close button walks into the page
      // behind the backdrop, where the user can focus controls they cannot
      // see.
      const nodes = panelRef.current?.querySelectorAll(FOCUSABLE)
      if (!nodes?.length) return

      const first = nodes[0]
      const last = nodes[nodes.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Hide the rest of the page from assistive tech while the dialog is open.
    // Targets #app-shell specifically — the modal is a sibling of it, so
    // hiding a common ancestor would hide the dialog itself.
    const appShell = document.getElementById('app-shell')
    appShell?.setAttribute('aria-hidden', 'true')

    // Restore focus to whatever opened the modal when it closes.
    const opener = document.activeElement
    closeRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previous
      appShell?.removeAttribute('aria-hidden')
      if (opener instanceof HTMLElement) opener.focus()
    }
  }, [onClose])

  if (!project) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`git clone ${project.github}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be blocked by permissions; failing silently here is
      // fine because the command is visible on screen to copy manually.
    }
  }

  const Icon = project.icon

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6 bg-paper/95 backdrop-blur-xl overflow-y-auto"
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 24 }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card rounded-2xl max-w-3xl w-full my-auto max-h-none sm:max-h-[90vh] sm:overflow-y-auto"
      >
        {/* Header */}
        <div className="relative h-44 sm:h-52 bg-gradient-to-br from-accent-fill/20 to-accent-fill/10 overflow-hidden rounded-t-2xl">
          <div className="absolute inset-0 bg-surface/50" />

          <div className="absolute inset-0 overflow-hidden opacity-30" aria-hidden="true">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="absolute w-full h-px bg-accent-fill/20"
                style={{ top: `${i * 5}%` }}
              />
            ))}
          </div>

          <motion.button
            ref={closeRef}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            aria-label="Close project details"
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-lg bg-surface/80 border border-ink/10 flex items-center justify-center text-ink-soft hover:text-ink hover:border-accent/50 transition-all"
          >
            <X size={20} aria-hidden="true" />
          </motion.button>

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="flex items-end gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-surface/80 border border-accent/30 flex items-center justify-center flex-shrink-0">
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-accent" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {project.featured && <span className="protocol-tag text-[10px]">FEATURED</span>}
                  {project.status && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest text-ink bg-ink/10 border border-ink/15">
                      {project.status}
                    </span>
                  )}
                </div>
                <h2
                  id="project-modal-title"
                  className="font-mono text-2xl md:text-3xl font-bold text-ink leading-tight"
                >
                  {project.title}
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Links */}
          {(project.github || project.demo) && (
            <div className="flex flex-wrap gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-ink/5 border border-ink/10 hover:border-accent/30 text-ink hover:text-ink transition-all"
                >
                  <Github size={18} aria-hidden="true" />
                  <span className="text-sm font-mono">Source</span>
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent-fill/10 border border-accent/30 text-accent hover:bg-accent-fill/20 transition-all"
                >
                  <ExternalLink size={18} aria-hidden="true" />
                  <span className="text-sm font-mono">Live Demo</span>
                </a>
              )}
            </div>
          )}

          <Section icon={Target} title="THE PROBLEM" tint="#f87171" show={!!project.problem}>
            <p className="text-ink-soft leading-relaxed">{project.problem}</p>
          </Section>

          <Section icon={Lightbulb} title="THE SOLUTION" tint="#C8FF3D" show={!!project.solution}>
            <p className="text-ink-soft leading-relaxed">{project.solution}</p>
          </Section>

          <Section
            icon={Network}
            title="ARCHITECTURE"
            tint="#C8FF3D"
            show={!!project.architecture}
          >
            <p className="text-ink-soft leading-relaxed">{project.architecture}</p>
          </Section>

          <Section
            icon={ListChecks}
            title="KEY FEATURES"
            tint="#8b5cf6"
            show={!!project.features?.length}
          >
            <ul className="space-y-2.5">
              {project.features?.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-ink-soft text-sm">
                  <span className="text-[#8b5cf6] mt-0.5 flex-shrink-0" aria-hidden="true">
                    ▸
                  </span>
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section
            icon={Mountain}
            title="CHALLENGES"
            tint="#fbbf24"
            show={!!project.challenges?.length}
          >
            <ul className="space-y-3">
              {project.challenges?.map((c) => (
                <li
                  key={c}
                  className="text-ink-soft text-sm leading-relaxed bg-ink/[0.03] border border-ink/5 rounded-xl p-4"
                >
                  {c}
                </li>
              ))}
            </ul>
          </Section>

          <Section icon={Layers} title="TECH STACK" tint="#8b5cf6">
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 text-sm font-mono text-accent bg-accent-fill/10 border border-accent/20 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Section>

          <Section icon={TrendingUp} title="OUTCOME" tint="#C8FF3D" show={!!project.impact}>
            <div className="p-4 rounded-xl bg-gradient-to-r from-accent-fill/10 to-accent-fill/5 border border-accent/20">
              <p className="text-ink font-medium leading-relaxed">{project.impact}</p>
            </div>
          </Section>

          {/* Clone command */}
          {project.github && (
            <div className="p-4 rounded-xl bg-surface border border-ink/5">
              <div className="flex items-center justify-between gap-4">
                <div className="font-mono text-xs sm:text-sm min-w-0 overflow-x-auto">
                  <span className="text-ink-faint">$ </span>
                  <span className="text-accent">git clone </span>
                  <span className="text-ink-soft whitespace-nowrap">{project.github}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  aria-label="Copy clone command"
                  className="p-2 rounded-lg bg-ink/5 border border-ink/10 text-ink-soft hover:text-accent hover:border-accent/30 transition-all flex-shrink-0"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProjectModal
