import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Terminal, FileText, Sun, Moon, Compass } from 'lucide-react'
import { cn } from '../utils/cn'
import { identity } from '../data/profile'
import { useTheme } from '../hooks/useTheme.jsx'

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Education', href: '#education' },
  { name: 'Now', href: '#learning' },
  { name: 'Contact', href: '#contact' },
]

const Navbar = ({ onReplayGuide }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const { theme, toggleTheme } = useTheme()
  
  // Track Active Section for highlighting
  const [activeIndex, setActiveIndex] = useState(0)

  // Scroll spy. Throttled through rAF so it doesn't run layout reads on
  // every scroll event, and registered passive so it never blocks scrolling.
  useEffect(() => {
    let frame = null

    const measure = () => {
      frame = null
      setIsScrolled(window.scrollY > 50)

      const probe = window.scrollY + window.innerHeight * 0.35

      let current = -1
      navLinks.forEach((link, index) => {
        const section = document.querySelector(link.href)
        if (section && section.offsetTop <= probe) current = index
      })
      // -1 means we're still above the first section (in the hero).
      setActiveIndex(current)
    }

    const handleScroll = () => {
      if (frame === null) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      // Clear the inline style on close (rather than writing "unset") so the
      // stylesheet's overflow-x: hidden on body is restored, not overridden.
      return () => {
        document.body.style.overflow = ''
      }
    }
    return undefined
  }, [isMobileMenuOpen])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.6, 0, 0.2, 1] }}
        className={cn(
          // Centred with left-0/right-0 + mx-auto rather than left-1/2 +
          // -translate-x-1/2: framer-motion writes an inline transform for the
          // y entrance, which would override (and defeat) the translate class.
          "fixed top-4 left-0 right-0 mx-auto z-50 transition-all duration-500 w-[95%] max-w-5xl",
          isScrolled ? "top-4" : "top-8"
        )}
      >
        <div className="bg-surface/80 backdrop-blur-2xl border border-ink/10 shadow-[0_8px_32px_rgb(0_0_0_/_0.22)] rounded-full px-6 py-3 flex items-center justify-between">
          
          {/* Logo */}
          <motion.a
            href="#hero"
            aria-label="Karthik Suru — back to top"
            className="flex items-center gap-3 group relative z-10"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-fill/20 to-accent-fill/20 border border-ink/10 flex items-center justify-center group-hover:border-accent/50 transition-all shadow-inner">
              <Terminal className="w-4 h-4 text-accent" aria-hidden="true" />
            </div>
            <span className="hidden lg:block font-mono text-sm font-bold tracking-widest text-ink">
              KS
            </span>
          </motion.a>

          {/* Desktop Navigation. Full link set from lg up — below that the
              row (links + résumé + controls) overflows the pill and pushes
              the theme toggle off-screen. */}
          <div className="hidden lg:flex items-center justify-center gap-2 relative">
            {navLinks.map((link, index) => {
              const isActive = activeIndex === index;
              const isHovered = hoveredIndex === index;
              
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors duration-300 rounded-full",
                    isActive ? "text-ink" : "text-ink-soft hover:text-ink"
                  )}
                >
                  <span className="relative z-10">{link.name}</span>
                  
                  {/* Hover Background */}
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="hoverBackground"
                      className="absolute inset-0 bg-ink/5 rounded-full z-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}

                  {/* Active Indicator (Pill) */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBackground"
                      className="absolute inset-0 bg-ink/10 border border-ink/5 rounded-full z-0 shadow-[inset_0_1px_rgba(255,255,255,0.1)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              )
            })}
          </div>

          {/* Status Indicator / Mobile Toggle */}
          <div className="flex items-center gap-4 relative z-10">
            <a
              href={identity.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
              <span className="text-xs font-semibold text-accent tracking-wider uppercase">
                Résumé
              </span>
            </a>

            {/* Replay the first-visit guidance tour. */}
            <motion.button
              type="button"
              id="tour-replay"
              onClick={onReplayGuide}
              whileTap={{ scale: 0.9 }}
              aria-label="Show site guide"
              title="Show site guide"
              className="w-10 h-10 rounded-full bg-ink/5 border border-ink/10 flex items-center justify-center text-ink hover:text-accent hover:border-accent/30 transition-colors"
            >
              <Compass size={16} aria-hidden="true" />
            </motion.button>

            {/* Light/dark toggle. Light is the landing default; the tour
                points here first so visitors can see both skins. */}
            <motion.button
              type="button"
              id="theme-toggle"
              onClick={toggleTheme}
              whileTap={{ scale: 0.9, rotate: 15 }}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="w-10 h-10 rounded-full bg-ink/5 border border-ink/10 flex items-center justify-center text-ink hover:text-accent hover:border-accent/30 transition-colors"
            >
              {theme === 'dark'
                ? <Sun size={16} aria-hidden="true" />
                : <Moon size={16} aria-hidden="true" />}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              aria-label="Open navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden w-10 h-10 rounded-full bg-ink/5 border border-ink/10 flex items-center justify-center text-ink"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={18} aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-paper/95 backdrop-blur-2xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-surface border-l border-ink/10 shadow-2xl flex flex-col"
            >
              <div className="flex flex-col h-full p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                  <span className="font-semibold tracking-widest text-xs text-ink-faint uppercase">Menu</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close navigation menu"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-10 h-10 rounded-full bg-ink/5 border border-ink/10 flex items-center justify-center text-ink"
                  >
                    <X size={18} aria-hidden="true" />
                  </motion.button>
                </div>

                {/* Links */}
                <div className="space-y-2 flex-grow">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-ink/5 border border-ink/5 hover:border-ink/20 transition-all group"
                    >
                      <span className="text-accent font-mono text-xs opacity-50">0{index + 1}</span>
                      <span className="font-semibold text-xl text-ink group-hover:text-ink transition-colors">
                        {link.name}
                      </span>
                    </motion.a>
                  ))}
                </div>

                <a
                  href={identity.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-accent/10 border border-accent/25 text-accent font-semibold mt-4"
                >
                  <FileText size={18} aria-hidden="true" />
                  Download Résumé
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
