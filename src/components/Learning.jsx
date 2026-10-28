import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { CheckCircle2, CircleDot, Circle, Compass } from 'lucide-react'
import { learningRoadmap, philosophy } from '../data/profile'
import { cn } from '../utils/cn'

const statusMeta = {
  solid: {
    icon: CheckCircle2,
    color: '#C8FF3D',
    label: 'Solid',
    hint: 'Comfortable building with this today',
  },
  active: {
    icon: CircleDot,
    color: '#C8FF3D',
    label: 'Learning now',
    hint: 'Actively deepening',
  },
  next: {
    icon: Circle,
    color: '#8b5cf6',
    label: 'Up next',
    hint: 'Queued, not started',
  },
}

const RoadmapNode = ({ item, index, isInView, isLast }) => {
  const meta = statusMeta[item.status]
  const Icon = meta.icon

  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="relative flex items-center gap-4 pb-5 last:pb-0"
    >
      {/* Connector */}
      {!isLast && (
        <span
          className="absolute left-[13px] top-7 bottom-0 w-px"
          style={{
            background: `linear-gradient(180deg, ${meta.color}55, transparent)`,
          }}
          aria-hidden="true"
        />
      )}

      <span
        className="relative z-10 w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: '#0B0B0D',
          border: `1px solid ${meta.color}44`,
        }}
      >
        <Icon className="w-4 h-4" style={{ color: meta.color }} aria-hidden="true" />
      </span>

      <div className="flex items-baseline gap-3 flex-wrap min-w-0">
        <span
          className={cn(
            'font-medium',
            item.status === 'next' ? 'text-gray-500' : 'text-gray-200'
          )}
        >
          {item.name}
        </span>
        <span
          className="text-[10px] font-mono uppercase tracking-widest"
          style={{ color: `${meta.color}aa` }}
        >
          {meta.label}
        </span>
      </div>
    </motion.li>
  )
}

const Learning = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="learning" className="py-32 md:py-40 relative">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-[#0ff] font-mono text-sm tracking-[0.3em] uppercase mb-4 block">
            Now
          </span>
          <h2 className="font-display text-5xl md:text-6xl text-white tracking-tight">
            What I'm{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-200">
              Working On
            </span>
          </h2>
          <p className="text-gray-500 mt-5 max-w-xl mx-auto leading-relaxed">
            An honest map of where I am rather than a list of everything I've touched. The
            distinction between "solid" and "up next" is the useful part.
          </p>
        </motion.div>

        <div ref={ref} className="grid lg:grid-cols-5 gap-6">
          {/* Roadmap */}
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#0B0B0D]/70 backdrop-blur-xl p-8">
            <h3 className="flex items-center gap-3 text-sm font-mono uppercase tracking-widest text-gray-500 mb-7">
              <Compass className="w-4 h-4 text-[#C8FF3D]" aria-hidden="true" />
              Learning path
            </h3>

            <ol className="flex flex-col">
              {learningRoadmap.map((item, i) => (
                <RoadmapNode
                  key={item.name}
                  item={item}
                  index={i}
                  isInView={isInView}
                  isLast={i === learningRoadmap.length - 1}
                />
              ))}
            </ol>

            <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-x-5 gap-y-2">
              {Object.entries(statusMeta).map(([key, meta]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: meta.color }}
                    aria-hidden="true"
                  />
                  <span className="text-[11px] text-gray-500">{meta.hint}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Philosophy */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            <h3 className="text-sm font-mono uppercase tracking-widest text-gray-500">
              How I approach the work
            </h3>

            {philosophy.map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-[#0B0B0D]/70 backdrop-blur-xl p-7 hover:border-white/20 transition-colors flex-1"
              >
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="font-mono text-xs text-[#C8FF3D]/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h4 className="text-lg font-bold text-white tracking-tight">{item.title}</h4>
                </div>
                <p className="text-gray-400 leading-relaxed">{item.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Learning
