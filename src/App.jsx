import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Education from './components/Education'
import Learning from './components/Learning'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ProjectModal from './components/ProjectModal'
import ParticleBackground from './components/ParticleBackground'
import ChatPanel from './components/ChatPanel'

function App() {
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <div className="min-h-screen bg-[#050505] relative">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ParticleBackground />
      {/* id is used by ProjectModal to hide the page from assistive tech
          while the dialog is open. The modal renders outside this div. */}
      <div id="app-shell" className="relative z-10">
        <Navbar />
        <main id="main">
          <Hero />
          <About />
          <Skills />
          <Projects onProjectClick={setSelectedProject} />
          <Experience />
          <Education />
          <Learning />
          <Contact />
        </main>
        <Footer />
      </div>
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
      <ChatPanel />
    </div>
  )
}

export default App
