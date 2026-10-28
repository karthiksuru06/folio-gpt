import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Github, Linkedin, Mail, Terminal, ArrowUpRight } from 'lucide-react'
import { identity } from '../data/profile'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const containerRef = useRef(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  })

  // Slower upward movement for parallax
  const y = useTransform(scrollYProgress, [0, 1], [150, 0])

  return (
    <footer ref={containerRef} className="relative overflow-hidden bg-[#050505] pt-32 pb-16">
      <div className="absolute inset-0 bg-gradient-to-t from-[#00f3ff]/5 via-transparent to-transparent pointer-events-none" />

      <motion.div style={{ y }} className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Massive Typography CTA */}
        <div className="text-center mb-32">
          <motion.h2 
            className="text-[12vw] leading-none font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            LET'S TALK
          </motion.h2>
          <motion.a
            href={`mailto:${identity.email}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-semibold text-lg hover:bg-gray-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.3)]"
          >
            Get in touch
            <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
          </motion.a>
        </div>

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 pb-16 border-b border-white/10">
          
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00f3ff]/20 to-[#0aff60]/20 border border-[#00f3ff]/30 flex items-center justify-center shadow-lg">
                <Terminal className="w-6 h-6 text-[#00f3ff]" aria-hidden="true" />
              </div>
              <div className="font-mono font-bold text-lg tracking-widest">
                <span className="text-[#00f3ff]">KARTHIK</span>
                <span className="text-gray-600">.</span>
                <span className="text-white">SURU</span>
              </div>
            </div>
            <p className="text-gray-400 max-w-sm mb-8 leading-relaxed">
              AI Engineer building production LLM systems and the full-stack products around them.
              Currently open to AI and backend engineering roles.
            </p>

            {/* Social Plates */}
            <div className="flex gap-4">
              {[
                { icon: Github, url: identity.github, label: 'GitHub' },
                { icon: Linkedin, url: identity.linkedin, label: 'LinkedIn' },
                { icon: Mail, url: `mailto:${identity.email}`, label: 'Email' },
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.url}
                  target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 shadow-md"
                >
                  <social.icon size={20} aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8 md:text-right md:justify-end">
            <div className="flex flex-col gap-4 md:items-end">
              <span className="text-white font-semibold mb-2">Navigation</span>
              {[
                { label: 'Home', href: '#hero' },
                { label: 'About', href: '#about' },
                { label: 'Skills', href: '#skills' },
                { label: 'Projects', href: '#projects' },
                { label: 'Experience', href: '#experience' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-[#00f3ff] transition-colors font-medium relative group w-max"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00f3ff] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-4 md:items-end">
              <span className="text-white font-semibold mb-2">Reach Out</span>
              <a
                href={`mailto:${identity.email}`}
                className="text-gray-400 hover:text-white transition-colors font-medium"
              >
                Email
              </a>
              <a
                href={identity.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors font-medium"
              >
                LinkedIn
              </a>
              <a
                href={identity.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors font-medium"
              >
                GitHub
              </a>
              <a
                href={identity.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors font-medium"
              >
                Résumé
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">
            &copy; {currentYear} KARTHIK SURU. ALL RIGHTS RESERVED.
          </p>

          <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">
            BUILT WITH REACT, TAILWIND &amp; FRAMER MOTION
          </p>
        </div>
      </motion.div>
    </footer>
  )
}

export default Footer
