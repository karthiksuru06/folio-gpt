import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Calendar, GitMerge, Code2, FlaskConical, Snowflake } from 'lucide-react'
import { experience } from '../data/profile'

// Icon lookup keyed by the `type` field in profile data, so the data file
// stays free of React imports.
const typeIcons = {
  internship: FlaskConical,
  engineering: Code2,
  'open source': GitMerge,
}

const experiences = experience.map((item) => ({
  ...item,
  icon: item.period === 'Dec 2025' ? Snowflake : typeIcons[item.type] ?? Code2,
}))

const TimelineItem = ({ item }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <div ref={ref} className="relative flex gap-8 md:gap-12 w-full mb-16 last:mb-0">
      
      {/* Icon Node */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-20 hidden md:flex"
      >
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center bg-surface border-2 shadow-2xl"
          style={{ borderColor: item.color, boxShadow: `0 0 20px ${item.color}20` }}
        >
          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: item.color }} />
          <item.icon className="w-7 h-7" style={{ color: item.color }} />
        </div>
      </motion.div>

      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex-1"
      >
        <div className="bg-surface/80 backdrop-blur-xl border border-ink/10 hover:border-ink/20 transition-all duration-300 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="px-3 py-1 text-[10px] uppercase font-mono tracking-widest rounded-full"
                  style={{
                    backgroundColor: `${item.color}15`,
                    color: item.color,
                    border: `1px solid ${item.color}30`
                  }}
                >
                  {item.type}
                </span>
                <span className="text-accent font-semibold text-sm">{item.organization}</span>
              </div>
              <h3 className="font-bold text-2xl md:text-3xl text-ink tracking-tight">
                {item.title}
              </h3>
            </div>
            
            <div className="flex items-center gap-2 text-ink-faint text-sm font-mono bg-ink/5 px-4 py-2 rounded-full border border-ink/5">
              <Calendar size={14} />
              <span>{item.period}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-ink-soft mb-6 leading-relaxed text-sm md:text-base">
            {item.description}
          </p>

          {/* Highlights */}
          <div className="space-y-3 mb-6">
            {item.highlights.map((highlight, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-start gap-4 text-ink text-sm bg-ink/5 p-3 rounded-xl border border-ink/5"
              >
                <div className="mt-1" style={{ color: item.color }}>{'✧'}</div>
                <span className="leading-relaxed">{highlight}</span>
              </motion.div>
            ))}
          </div>

          {/* PRs (if any) */}
          {item.prs && (
            <div className="mt-8 pt-6 border-t border-ink/5">
              <span className="text-xs uppercase tracking-widest font-mono text-ink-faint mb-4 block">Key Contributions</span>
              <div className="flex flex-wrap gap-3">
                {item.prs.map((pr, i) => (
                  pr.url ? (
                    <motion.a
                      key={i}
                      href={pr.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(120, 120, 128, 0.12)' }}
                      className="flex items-center gap-3 bg-ink/5 border border-ink/10 px-4 py-2 rounded-lg transition-colors"
                    >
                      <GitMerge size={14} className="text-[#8b5cf6]" />
                      <span className="text-ink-soft font-mono text-xs">{pr.number}</span>
                    </motion.a>
                  ) : (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(120, 120, 128, 0.12)' }}
                      className="flex items-center gap-3 bg-ink/5 border border-ink/10 px-4 py-2 rounded-lg cursor-default transition-colors"
                    >
                      <GitMerge size={14} className="text-[#8b5cf6]" />
                      <span className="text-ink-soft font-mono text-xs">{pr.number}</span>
                    </motion.div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

const Experience = () => {
  const containerRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section id="experience" className="py-40 relative">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-24 text-center"
        >
          <span className="text-accent font-mono text-sm tracking-[0.3em] uppercase mb-4 block">Career & Research</span>
          <h2 className="font-display text-5xl md:text-7xl text-ink tracking-tight">
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink-faint to-ink">Journey</span>
          </h2>
        </motion.div>

        {/* Timeline Container */}
        <div ref={containerRef} className="relative">
          {/* Background Track Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-ink/5 rounded-full hidden md:block" />
          
          {/* Glowing Animated Line */}
          <motion.div 
            className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-accent via-accent-fill to-accent rounded-full hidden md:block origin-top shadow-[0_0_15px_rgba(200,255,61,0.35)]"
            style={{ scaleY }}
          />

          {/* Timeline Items */}
          <div className="flex flex-col">
            {experiences.map((item, index) => (
              <TimelineItem
                key={item.title}
                item={item}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience
