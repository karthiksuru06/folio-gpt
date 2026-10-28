import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { GraduationCap, Award, Trophy, BadgeCheck } from 'lucide-react'
import { education, achievements } from '../data/profile'

const tierStyles = {
  national: { icon: Trophy, color: '#00f3ff', label: 'National' },
  institutional: { icon: Award, color: '#0aff60', label: 'Institutional' },
  certification: { icon: BadgeCheck, color: '#8b5cf6', label: 'Certification' },
}

const Education = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="education" className="py-32 md:py-40 relative">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-[#0ff] font-mono text-sm tracking-[0.3em] uppercase mb-4 block">
            Background
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
            Education &amp; Recognition
          </h2>
        </motion.div>

        <div ref={ref} className="grid lg:grid-cols-2 gap-6">
          {/* Education */}
          <div className="space-y-5">
            <h3 className="flex items-center gap-3 text-sm font-mono uppercase tracking-widest text-gray-500 mb-2">
              <GraduationCap className="w-4 h-4 text-[#00f3ff]" aria-hidden="true" />
              Education
            </h3>

            {education.map((item, i) => (
              <motion.article
                key={item.degree}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl border border-white/10 bg-[#0a0a0c]/70 backdrop-blur-xl p-6 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                  <h4 className="text-lg font-bold text-white leading-snug">{item.degree}</h4>
                  {item.status === 'current' && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest text-[#0aff60] bg-[#0aff60]/10 border border-[#0aff60]/25 flex-shrink-0">
                      In progress
                    </span>
                  )}
                </div>
                <p className="text-[#00f3ff] text-sm font-medium">{item.institution}</p>
                <p className="text-gray-500 text-xs font-mono mt-1 mb-3">
                  {item.period} · {item.specialization}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">{item.detail}</p>
              </motion.article>
            ))}
          </div>

          {/* Achievements */}
          <div className="space-y-5">
            <h3 className="flex items-center gap-3 text-sm font-mono uppercase tracking-widest text-gray-500 mb-2">
              <Trophy className="w-4 h-4 text-[#0aff60]" aria-hidden="true" />
              Achievements
            </h3>

            {achievements.map((item, i) => {
              const style = tierStyles[item.tier] ?? tierStyles.certification
              const Icon = style.icon

              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="rounded-2xl border border-white/10 bg-[#0a0a0c]/70 backdrop-blur-xl p-6 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${style.color}22, ${style.color}08)`,
                        border: `1px solid ${style.color}33`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: style.color }} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap mb-1">
                        <h4 className="text-base font-bold text-white leading-snug">{item.title}</h4>
                        <span className="text-gray-600 font-mono text-xs">{item.year}</span>
                      </div>
                      <p className="text-sm font-medium mb-2" style={{ color: style.color }}>
                        {item.issuer}
                      </p>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.detail}</p>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Education
