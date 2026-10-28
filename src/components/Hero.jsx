import { motion } from 'framer-motion'
import { ChevronDown, FileText, ArrowRight } from 'lucide-react'
import { identity, availability } from '../data/profile'

// Framer Motion Variants for Staggered Text Reveal
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 10 }
  },
}

const Hero = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Premium Aurora Environment */}
      <div className="aurora-bg" />
      
      {/* Front-layer glow mask to blend it deeply into the background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_100%)] pointer-events-none z-0" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 text-center relative z-10 w-full"
      >
        {/* Verification Pill */}
        <motion.div variants={itemVariants} className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f3ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f3ff]"></span>
            </span>
            <span className="text-xs font-mono text-gray-300 uppercase tracking-widest">
              {availability.headline}
            </span>
          </div>
        </motion.div>

        {/* Hero Typography */}
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter leading-none">
            <span className="text-white block">{identity.first}</span>
            <span className="gradient-text block mt-2">{identity.last}</span>
          </h1>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-4">
          <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
            <span className="text-white font-medium">AI Engineer</span> building production LLM
            systems, <span className="text-[#0aff60] font-medium">RAG pipelines</span>, and the
            full-stack products around them.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-12">
          <p className="text-sm md:text-base text-gray-500 font-mono tracking-wide">
            Python · FastAPI · React · PyTorch — final-year CS, graduating 2027
          </p>
        </motion.div>

        {/* Action Buttons with Advanced Hover Physics */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <motion.a
            href="#projects"
            className="group relative px-8 py-4 rounded-xl bg-white text-black font-semibold tracking-wide overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#00f3ff] to-[#0aff60] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
            <span className="relative z-10 flex items-center gap-3 group-hover:text-black transition-colors duration-300">
              View Projects
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </motion.a>

          <motion.a
            href={identity.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-white font-semibold tracking-wide"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400 group-hover:text-[#00f3ff] transition-colors duration-300" />
              Download Résumé
            </span>
          </motion.a>
        </motion.div>

        {/* Stats — every figure here is independently checkable. */}
        <motion.div
          variants={itemVariants}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[
            { value: '3', label: 'Research Internships', sub: 'RCTS, IIIT Hyderabad' },
            { value: '37', label: 'Public Repositories', sub: identity.githubHandle },
            { value: 'National', label: 'Competition Finalist', sub: 'ANVAKRIT 2025 · NFSU' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md hover:border-white/20 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-white font-medium">{stat.label}</div>
              <div className="text-sm text-gray-500">{stat.sub}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span className="text-[10px] font-mono tracking-[0.2em] text-gray-500 uppercase">Discover</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </motion.div>

      </motion.div>
    </section>
  )
}

export default Hero
