import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Brain, GitBranch, Server, Microscope } from 'lucide-react'

const highlights = [
  {
    icon: Brain,
    title: 'Applied AI',
    description: 'LLM integration, RAG pipelines, and agent systems that run in production',
    color: '#0aff60',
  },
  {
    icon: Server,
    title: 'Backend Engineering',
    description: 'FastAPI services, Postgres and vector stores, containerised deployment',
    color: '#00f3ff',
  },
  {
    icon: Microscope,
    title: 'Research',
    description: 'Three engagements at RCTS, IIIT Hyderabad across ML and applied research',
    color: '#8b5cf6',
  },
  {
    icon: GitBranch,
    title: 'Open Source',
    description: 'Contributing to OpenWISP and Code for GovTech',
    color: '#ff006e',
  },
]

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="data-label">01</span>
            <h2 className="font-mono text-3xl md:text-4xl font-bold text-white">
              ABOUT
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-[#00f3ff]/30 to-transparent" />
          </div>
        </motion.div>

        <div ref={ref} className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3"
          >
            <div className="bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 shadow-2xl rounded-3xl p-10">
              {/* Terminal Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="font-mono text-xs text-gray-500">about.sh</span>
              </div>

              <div className="space-y-5 text-gray-300 leading-relaxed">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-[#00f3ff] font-mono">{'>'}</span>{' '}
                  I'm an <span className="text-[#0aff60] font-medium">AI Engineer</span> who likes
                  the unglamorous half of the job — the retrieval that returns the right chunk, the
                  API that doesn't fall over, the evaluation that tells you whether any of it
                  actually worked.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-[#00f3ff] font-mono">{'>'}</span>{' '}
                  Most of my work has come out of three engagements at{' '}
                  <span className="text-white font-medium">RCTS, IIIT Hyderabad</span> — building ML
                  models for social-impact research and the API layers that put them in front of
                  real users.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 }}
                >
                  <span className="text-[#00f3ff] font-mono">{'>'}</span>{' '}
                  Outside that I build things end to end: retrieval systems over private document
                  corpora, agent workflows with human approval gates, and computer-vision models
                  trained and benchmarked properly rather than left in a notebook.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 }}
                  className="text-gray-500 text-sm"
                >
                  <span className="text-[#0aff60] font-mono">{'>'}</span>{' '}
                  Final year of a CS degree at KIET Kakinada, graduating May 2027. Currently
                  going deeper on PyTorch, MLOps, and distributed systems.
                </motion.p>
              </div>

              {/* Code Block */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
                className="mt-8 p-5 rounded-xl bg-[#050505] border border-white/5 font-mono text-sm"
              >
                <div className="text-gray-500 mb-3">{'// now.json'}</div>
                <div className="space-y-1">
                  <div>
                    <span className="text-[#8b5cf6]">{'{'}</span>
                  </div>
                  <div className="ml-4">
                    <span className="text-[#00f3ff]">"building"</span>
                    <span className="text-gray-500">: </span>
                    <span className="text-[#0aff60]">"Yukthi — governed AI agents for SMBs"</span>
                    <span className="text-gray-500">,</span>
                  </div>
                  <div className="ml-4">
                    <span className="text-[#00f3ff]">"learning"</span>
                    <span className="text-gray-500">: </span>
                    <span className="text-[#0aff60]">["PyTorch", "MLOps", "Advanced DSA"]</span>
                    <span className="text-gray-500">,</span>
                  </div>
                  <div className="ml-4">
                    <span className="text-[#00f3ff]">"open_to"</span>
                    <span className="text-gray-500">: </span>
                    <span className="text-[#0aff60]">"AI / Backend Engineering roles"</span>
                  </div>
                  <div>
                    <span className="text-[#8b5cf6]">{'}'}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Highlight Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 space-y-4"
          >
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ x: 8, scale: 1.02 }}
                className="bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 rounded-2xl p-6 group cursor-default shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${item.color}20, ${item.color}10)`,
                      border: `1px solid ${item.color}30`
                    }}
                  >
                    <item.icon
                      className="w-5 h-5 transition-colors duration-300"
                      style={{ color: item.color }}
                    />
                  </div>
                  <div>
                    <h3 className="font-mono font-semibold text-white mb-1 group-hover:text-[#00f3ff] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 gap-4 mt-6"
            >
              {[
                { value: '3', label: 'Internships' },
                { value: '37', label: 'Repositories' },
                { value: '2027', label: 'Graduating' },
                { value: 'IIIT-H', label: 'ML Certified' },
              ].map((stat, i) => (
                <div key={i} className="bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/10 hover:border-[#00f3ff]/30 transition-all duration-300 rounded-2xl p-5 text-center shadow-lg">
                  <div className="font-mono text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-gray-400 font-semibold text-xs mt-2 tracking-widest uppercase">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
