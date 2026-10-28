import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import {
  ExternalLink, Github, ArrowRight, Bot, Brain, FileSearch, Mic, Palette,
  Aperture, ShieldCheck, Siren, GraduationCap, Boxes,
} from 'lucide-react'
import { projects as projectData } from '../data/projects'
import { identity } from '../data/profile'

const iconMap = {
  Bot, Brain, FileSearch, Mic, Palette, Aperture, ShieldCheck, Siren, GraduationCap,
}

// Resolve icon names to components once, rather than per render.
const projects = projectData.map((p) => ({ ...p, icon: iconMap[p.icon] ?? Boxes }))

const TiltCard = ({ children, onClick, label }) => {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onKeyDown={(e) => {
        // The card opens a dialog, so it has to behave like a button for
        // keyboard users. But it also *contains* anchors (GitHub / demo),
        // and keydown bubbles — without this target check, pressing Enter on
        // a focused inner link would preventDefault the anchor's own
        // activation and open the modal instead of following the link.
        if (e.target !== e.currentTarget) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={label}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative h-full w-full rounded-2xl cursor-pointer perspective-1000"
    >
      <div 
        className="absolute inset-0 z-0 scale-105 rounded-2xl bg-gradient-to-br from-[#C8FF3D]/20 to-[#C8FF3D]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ transform: "translateZ(-50px)" }}
      />
      {children}
    </motion.div>
  );
};

const ProjectCard = ({ project, onClick, index, isInView }) => {
  const Icon = project.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group h-full perspective-1000"
    >
      <TiltCard
        onClick={() => onClick(project)}
        label={`${project.title} — view case study`}
      >
        <div 
          className="h-full bg-[#0B0B0D]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col group-hover:border-[#C8FF3D]/30 transition-colors duration-500"
          style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
        >
          {/* Project Header */}
          <div className="h-40 bg-white/5 relative overflow-hidden p-6 border-b border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-[#C8FF3D]/5 to-transparent opacity-50" />
            
            {/* Soft mesh overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMCIvPgo8cGF0aCBkPSJNMCAweDh2OEgweiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+Cjwvc3ZnPg==')]" />

            <motion.div
              style={{ transform: "translateZ(40px)" }}
              className="relative w-12 h-12 rounded-xl bg-[#0B0B0D] border border-white/10 flex items-center justify-center mb-4 shadow-xl"
            >
              <Icon className="w-6 h-6 text-[#0ff] group-hover:text-[#C8FF3D] transition-colors" />
            </motion.div>

            <motion.h3 
              style={{ transform: "translateZ(30px)" }}
              className="relative font-bold text-xl text-white tracking-tight"
            >
              {project.title}
            </motion.h3>

            <motion.div
              style={{ transform: 'translateZ(20px)' }}
              className="absolute top-4 right-4 flex flex-col items-end gap-1.5"
            >
              {project.demo && (
                <span className="px-2 py-1 text-[9px] uppercase tracking-widest font-mono text-[#C8FF3D] bg-[#C8FF3D]/10 border border-[#C8FF3D]/25 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF3D] animate-pulse" />
                  Live
                </span>
              )}
              {project.featured && (
                <span className="px-2 py-1 text-[9px] uppercase tracking-widest font-mono text-[#0ff] bg-[#0ff]/10 border border-[#0ff]/20 rounded-full">
                  Featured
                </span>
              )}
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-grow">
            <motion.p 
              style={{ transform: "translateZ(20px)" }}
              className="text-gray-400 text-sm mb-6 flex-grow leading-relaxed"
            >
              {project.shortDesc}
            </motion.p>

            {/* Tech Stack Tags */}
            <motion.div style={{ transform: "translateZ(25px)" }} className="flex flex-wrap gap-2 mb-6">
              {project.techStack.slice(0, 3).map((tech) => (
                <span key={tech} className="px-2 py-1 text-[10px] uppercase font-mono tracking-wider text-gray-300 bg-white/5 rounded-md border border-white/5">
                  {tech}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span className="px-2 py-1 text-[10px] font-mono text-gray-500">
                  +{project.techStack.length - 3}
                </span>
              )}
            </motion.div>

            {/* Links */}
            <motion.div 
              style={{ transform: "translateZ(30px)" }}
              className="flex items-center justify-between pt-4 border-t border-white/5"
            >
              <div className="flex gap-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`${project.title} — view source on GitHub`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Github size={18} aria-hidden="true" />
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`${project.title} — open live demo`}
                    className="text-gray-400 hover:text-[#0ff] transition-colors"
                  >
                    <ExternalLink size={18} aria-hidden="true" />
                  </a>
                )}
              </div>
              <span className="text-[#0ff] text-xs font-mono font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                Details <ArrowRight size={14} />
              </span>
            </motion.div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}

const Projects = ({ onProjectClick }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="projects" className="py-40 relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <span className="text-[#0ff] font-mono text-sm tracking-[0.3em] uppercase mb-4 block">
            Case Studies
          </span>
          <h2 className="font-display text-5xl md:text-6xl text-white tracking-tight">
            Selected{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-200">
              Projects
            </span>
          </h2>
          <p className="text-gray-500 mt-5 max-w-xl mx-auto leading-relaxed">
            Each one opens into the problem it solved, how it was built, and what broke along the
            way. Click through — the interesting part is usually the constraint.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={onProjectClick}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <a
            href={identity.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-white/25 transition-all font-medium"
          >
            <Github size={18} aria-hidden="true" />
            See the rest on GitHub
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
