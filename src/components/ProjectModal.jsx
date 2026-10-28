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
        <h3 className="font-mono font-semibold text-white text-lg">{title}</h3>
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
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6 bg-[#050505]/95 backdrop-blur-xl overflow-y-auto"
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
        <div className="relative h-44 sm:h-52 bg-gradient-to-br from-[#00f3ff]/20 to-[#0aff60]/10 overflow-hidden rounded-t-2xl">
          <div className="absolute inset-0 bg-[#050505]/50" />

          <div className="absolute inset-0 overflow-hidden opacity-30" aria-hidden="true">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="absolute w-full h-px bg-[#00f3ff]/20"
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
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-lg bg-[#050505]/80 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-[#00f3ff]/50 transition-all"
          >
            <X size={20} aria-hidden="true" />
          </motion.button>

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="flex items-end gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#050505]/80 border border-[#00f3ff]/30 flex items-center justify-center flex-shrink-0">
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#00f3ff]" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {project.featured && <span className="protocol-tag text-[10px]">FEATURED</span>}
                  {project.status && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest text-gray-300 bg-white/10 border border-white/15">
                      {project.status}
                    </span>
                  )}
                </div>
                <h2
                  id="project-modal-title"
                  className="font-mono text-2xl md:text-3xl font-bold text-white leading-tight"
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
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#00f3ff]/30 text-gray-300 hover:text-white transition-all"
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
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#00f3ff]/10 border border-[#00f3ff]/30 text-[#00f3ff] hover:bg-[#00f3ff]/20 transition-all"
                >
                  <ExternalLink size={18} aria-hidden="true" />
                  <span className="text-sm font-mono">Live Demo</span>
                </a>
              )}
            </div>
          )}

          <Section icon={Target} title="THE PROBLEM" tint="#f87171" show={!!project.problem}>
            <p className="text-gray-400 leading-relaxed">{project.problem}</p>
          </Section>

          <Section icon={Lightbulb} title="THE SOLUTION" tint="#0aff60" show={!!project.solution}>
            <p className="text-gray-400 leading-relaxed">{project.solution}</p>
          </Section>

          <Section
            icon={Network}
            title="ARCHITECTURE"
            tint="#00f3ff"
            show={!!project.architecture}
          >
            <p className="text-gray-400 leading-relaxed">{project.architecture}</p>
          </Section>

          <Section
            icon={ListChecks}
            title="KEY FEATURES"
            tint="#8b5cf6"
            show={!!project.features?.length}
          >
            <ul className="space-y-2.5">
              {project.features?.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-gray-400 text-sm">
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
                  className="text-gray-400 text-sm leading-relaxed bg-white/[0.03] border border-white/5 rounded-xl p-4"
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
                  className="px-3 py-1.5 text-sm font-mono text-[#00f3ff] bg-[#00f3ff]/10 border border-[#00f3ff]/20 rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Section>

          <Section icon={TrendingUp} title="OUTCOME" tint="#00f3ff" show={!!project.impact}>
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#00f3ff]/10 to-[#0aff60]/5 border border-[#00f3ff]/20">
              <p className="text-gray-200 font-medium leading-relaxed">{project.impact}</p>
            </div>
          </Section>

          {/* Clone command */}
          {project.github && (
            <div className="p-4 rounded-xl bg-[#050505] border border-white/5">
              <div className="flex items-center justify-between gap-4">
                <div className="font-mono text-xs sm:text-sm min-w-0 overflow-x-auto">
                  <span className="text-gray-500">$ </span>
                  <span className="text-[#0aff60]">git clone </span>
                  <span className="text-gray-400 whitespace-nowrap">{project.github}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  aria-label="Copy clone command"
                  className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-[#00f3ff] hover:border-[#00f3ff]/30 transition-all flex-shrink-0"
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
