import { motion, useInView } from 'framer-motion'
import { useRef, useState, useId } from 'react'
import {
  Code2, Brain, Sparkles, Server, Layout, Database, ArrowRight, ChevronDown,
} from 'lucide-react'
import { cn } from '../utils/cn'
import { skillGroups, techChains } from '../data/profile'

const iconMap = { Code2, Brain, Sparkles, Server, Layout, Database }

// Honest proficiency tiers instead of invented percentages.
const tierMeta = {
  core: { label: 'Core', dots: 3, hint: 'Used daily' },
  working: { label: 'Working', dots: 2, hint: 'Shipped real work with it' },
  familiar: { label: 'Familiar', dots: 1, hint: 'Still building depth' },
}

const TierDots = ({ tier, color }) => {
  const { dots } = tierMeta[tier]
  return (
    <span className="flex gap-1 flex-shrink-0" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
          style={{
            backgroundColor: i < dots ? color : 'rgba(255,255,255,0.12)',
            boxShadow: i < dots ? `0 0 6px ${color}66` : 'none',
          }}
        />
      ))}
    </span>
  )
}

const SkillRow = ({ skill, color, delay, isInView }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.4, delay }}
    className="group/skill relative flex items-center justify-between gap-3 py-2 border-b border-white/5 last:border-b-0"
  >
    <div className="min-w-0">
      <span className="text-gray-200 text-sm font-medium block truncate">{skill.name}</span>
      <span className="text-gray-500 text-[11px] leading-tight block truncate opacity-0 max-h-0 group-hover/skill:opacity-100 group-hover/skill:max-h-8 transition-all duration-300">
        {skill.note}
      </span>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0">
      <span className="text-[10px] font-mono uppercase tracking-wider text-gray-600 hidden sm:block">
        {tierMeta[skill.tier].label}
      </span>
      <TierDots tier={skill.tier} color={color} />
    </div>
  </motion.div>
)

const BentoCard = ({ category, index, isInView }) => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [expanded, setExpanded] = useState(false)
  const cardRef = useRef(null)
  const panelId = useId()
  const Icon = iconMap[category.icon] ?? Code2

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  // Collapse long lists on mobile; show everything from `md` up.
  const COLLAPSED = 5
  const isLong = category.skills.length > COLLAPSED
  const visible = expanded || !isLong ? category.skills : category.skills.slice(0, COLLAPSED)

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.97, y: 24 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      onMouseMove={handleMouseMove}
      className={cn('bento-card group', category.colSpan)}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none motion-reduce:hidden"
        style={{
          background: `radial-gradient(500px circle at ${mouse.x}px ${mouse.y}px, ${category.color}14, transparent 42%)`,
        }}
      />

      <div className="flex items-start gap-4 mb-5 relative z-10">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${category.color}22, ${category.color}06)`,
            border: `1px solid ${category.color}33`,
          }}
        >
          <Icon className="w-5 h-5" style={{ color: category.color }} />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-bold text-white tracking-tight">{category.title}</h3>
          <p className="text-gray-500 text-xs leading-relaxed mt-1">{category.blurb}</p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col">
        {visible.map((skill, i) => (
          <SkillRow
            key={skill.name}
            skill={skill}
            color={category.color}
            delay={index * 0.06 + i * 0.04}
            isInView={isInView}
          />
        ))}
      </div>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={panelId}
          className="relative z-10 mt-4 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gray-500 hover:text-white transition-colors self-start"
        >
          {expanded ? 'Show less' : `+${category.skills.length - COLLAPSED} more`}
          <ChevronDown
            className={cn('w-3.5 h-3.5 transition-transform duration-300', expanded && 'rotate-180')}
          />
        </button>
      )}
    </motion.div>
  )
}

/**
 * Technology chains — shows how the pieces compose into something shippable,
 * which reads as systems thinking rather than a wall of logos.
 */
const ChainRail = ({ chain, isInView, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
    className="rounded-2xl border border-white/5 bg-[#0B0B0D]/60 backdrop-blur-xl p-6 hover:border-white/15 transition-colors"
  >
    <div className="flex items-baseline gap-3 mb-1 flex-wrap">
      <span
        className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest"
        style={{
          color: chain.color,
          backgroundColor: `${chain.color}14`,
          border: `1px solid ${chain.color}33`,
        }}
      >
        {chain.label}
      </span>
    </div>
    <p className="text-gray-500 text-sm mb-5 leading-relaxed">{chain.description}</p>

    <ol className="flex flex-wrap items-center gap-x-1 gap-y-2">
      {chain.steps.map((step, i) => {
        const isLast = i === chain.steps.length - 1
        return (
          <li key={step} className="flex items-center gap-1">
            <span
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
                isLast
                  ? 'text-black font-semibold'
                  : 'text-gray-300 bg-white/5 border border-white/10'
              )}
              style={isLast ? { backgroundColor: chain.color } : undefined}
            >
              {step}
            </span>
            {!isLast && (
              <ArrowRight
                className="w-3.5 h-3.5 flex-shrink-0"
                style={{ color: `${chain.color}88` }}
                aria-hidden="true"
              />
            )}
          </li>
        )
      })}
    </ol>
  </motion.div>
)

const Skills = () => {
  const ref = useRef(null)
  const chainsRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const chainsInView = useInView(chainsRef, { once: true, margin: '-80px' })

  return (
    <section id="skills" className="py-32 md:py-40 relative">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-[#0ff] font-mono text-sm tracking-[0.3em] uppercase mb-4 block">
            Toolkit
          </span>
          <h2 className="font-display text-5xl md:text-6xl text-white tracking-tight">
            Technical{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-200">
              Skills
            </span>
          </h2>
          <p className="text-gray-500 mt-5 max-w-xl mx-auto leading-relaxed">
            Grouped by what I actually reach for, and how confident I am in each. No percentages —
            those are made up everywhere you see them.
          </p>

          {/* Legend */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {Object.entries(tierMeta).map(([key, meta]) => (
              <div key={key} className="flex items-center gap-2">
                <TierDots tier={key} color="#C8FF3D" />
                <span className="text-xs text-gray-500">
                  <span className="text-gray-300 font-medium">{meta.label}</span> — {meta.hint}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skillGroups.map((category, index) => (
            <BentoCard key={category.title} category={category} index={index} isInView={isInView} />
          ))}
        </div>

        {/* Technology chains */}
        <div ref={chainsRef} className="mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={chainsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-10 text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              How the pieces fit together
            </h3>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm leading-relaxed">
              Individual technologies matter less than the paths between them. These are the stacks
              I've actually carried end to end.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {techChains.map((chain, i) => (
              <ChainRail key={chain.id} chain={chain} isInView={chainsInView} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Skills
