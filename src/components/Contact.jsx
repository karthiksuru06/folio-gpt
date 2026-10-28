import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, Github, Linkedin, FileText, MapPin, Zap, AlertCircle } from 'lucide-react'
import { identity, availability } from '../data/profile'

const socialLinks = [
  { name: 'GitHub', icon: Github, url: identity.github, handle: identity.githubHandle, color: '#C8FF3D' },
  { name: 'LinkedIn', icon: Linkedin, url: identity.linkedin, handle: identity.linkedinHandle, color: '#C8FF3D' },
  { name: 'Email', icon: Mail, url: `mailto:${identity.email}`, handle: identity.email, color: '#8b5cf6' },
  { name: 'Résumé', icon: FileText, url: identity.resume, handle: 'PDF', color: '#ff006e' },
]

// Web3Forms access key. Free, no backend required.
// Get yours at https://web3forms.com — it is emailed to you instantly.
// This key is safe to expose publicly; it only permits sending to the
// address it was registered with.
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY ?? ''

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Fail loudly rather than pretending to send. A contact form that
    // silently drops recruiter mail is worse than no form at all.
    if (!WEB3FORMS_KEY) {
      setStatus('error')
      setErrorMsg(`Form not configured yet — please email ${identity.email} directly.`)
      return
    }

    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Portfolio contact from ${formData.name}`,
          from_name: formData.name,
          email: formData.email,
          message: formData.message,
          // Web3Forms honeypot: bots fill every field they find, so a
          // non-empty botcheck causes the submission to be dropped server
          // side. The access key is public by design (it can only send to
          // one address), so this is the available spam defence — without
          // it the free-tier quota can be burned and genuine mail bounces.
          botcheck: '',
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || `Request failed (${res.status})`)
      }

      setStatus('sent')
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 6000)
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        `Could not send — please email ${identity.email} directly. (${err.message})`
      )
    }
  }

  const isSubmitting = status === 'sending'
  const submitted = status === 'sent'

  return (
    <section id="contact" className="py-40 relative">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <span className="text-[#0ff] font-mono text-sm tracking-[0.3em] uppercase mb-4 block">Let's Connect</span>
          <h2 className="font-display text-5xl md:text-7xl text-white tracking-tight">
            Initiate <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-200">Contact</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Status & Socials */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {/* Live Status Card */}
            <div className="bg-[#0B0B0D]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-[#C8FF3D]/30 transition-colors shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(10,255,96,0.1)_0%,transparent_50%)] pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <Zap className="w-5 h-5 text-[#C8FF3D]" />
                <span className="font-mono text-sm tracking-widest text-gray-500 uppercase">Availability Profile</span>
              </div>
              
              <div className="p-5 rounded-2xl bg-[#0B0B0D] border border-white/5 relative z-10 shadow-inner">
                <div className="flex items-center gap-4">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8FF3D] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C8FF3D]"></span>
                  </span>
                  <span className="text-white font-semibold text-lg tracking-wide">
                    {availability.headline}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-3 ml-7 leading-relaxed">
                  {availability.detail}
                </p>
              </div>
            </div>

            {/* Social Grid */}
            <div className="grid grid-cols-2 gap-4">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`${link.name}: ${link.handle}`}
                  className="bg-[#0B0B0D]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 group hover:border-white/30 transition-all shadow-lg"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-inner transition-transform group-hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${link.color}15, transparent)`, border: `1px solid ${link.color}30` }}
                  >
                    <link.icon className="w-6 h-6" style={{ color: link.color }} aria-hidden="true" />
                  </div>
                  <span className="text-white font-semibold text-sm transition-all font-mono">
                    {link.name}
                  </span>
                  <span className="text-gray-500 text-[11px] font-mono truncate max-w-full px-2">
                    {link.handle}
                  </span>
                </motion.a>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-2 bg-white/5 border border-white/10 px-5 py-4 rounded-2xl backdrop-blur-md">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
              <span className="text-gray-300 text-sm">
                {identity.location}
                <span className="text-gray-500 block text-xs font-mono mt-0.5">
                  {identity.timezone} · open to remote
                </span>
              </span>
            </div>
          </motion.div>

          {/* Contact Form Terminal Style */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="bg-[#0B0B0D]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              {/* Top Bar */}
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="font-mono text-xs text-gray-500 ml-4 flex-grow">bash - send_secure_message.sh</span>
              </div>

              <div className="space-y-6">
                <div className="relative group">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-transparent focus:border-[#C8FF3D] focus:bg-white/10 transition-all outline-none peer"
                    id="name"
                    placeholder="Name"
                  />
                  <label htmlFor="name" className="absolute left-5 -top-2.5 bg-[#0B0B0D] px-2 text-xs font-mono text-gray-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#C8FF3D] transition-all">
                    IDENTIFIER
                  </label>
                </div>

                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-transparent focus:border-[#C8FF3D] focus:bg-white/10 transition-all outline-none peer"
                    id="email"
                    placeholder="Email"
                  />
                  <label htmlFor="email" className="absolute left-5 -top-2.5 bg-[#0B0B0D] px-2 text-xs font-mono text-gray-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#C8FF3D] transition-all">
                    RETURN_ADDRESS
                  </label>
                </div>

                <div className="relative group">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={2000}
                    rows={5}
                    className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-transparent focus:border-[#C8FF3D] focus:bg-white/10 transition-all outline-none resize-none peer"
                    id="message"
                    placeholder="Message"
                  />
                  <label htmlFor="message" className="absolute left-5 -top-2.5 bg-[#0B0B0D] px-2 text-xs font-mono text-gray-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#C8FF3D] transition-all">
                    PAYLOAD
                  </label>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting || submitted}
                  whileHover={!isSubmitting && !submitted ? { scale: 1.02, backgroundColor: "#fff", color: "#000" } : {}}
                  whileTap={!isSubmitting && !submitted ? { scale: 0.98 } : {}}
                  className="w-full relative overflow-hidden py-4 rounded-xl border border-white/20 text-white font-semibold flex items-center justify-center gap-3 transition-colors group disabled:opacity-80 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                      <span className="font-mono uppercase tracking-widest text-sm">Transmitting</span>
                    </>
                  ) : submitted ? (
                    <span className="font-mono uppercase tracking-widest text-[#C8FF3D] text-sm">Transmission Successful</span>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#C8FF3D]/20 to-[#C8FF3D]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <Send size={18} className="group-hover:text-black transition-colors z-10" />
                      <span className="font-mono uppercase tracking-widest text-sm group-hover:text-black transition-colors z-10">
                        Send Message
                      </span>
                    </>
                  )}
                </motion.button>

                {/* Errors are shown, never swallowed. */}
                {status === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="alert"
                    className="flex items-start gap-2.5 text-sm text-[#ff6b8a] bg-[#ff006e]/10 border border-[#ff006e]/25 rounded-xl p-4"
                  >
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="leading-relaxed">{errorMsg}</span>
                  </motion.p>
                )}

                {submitted && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    role="status"
                    className="text-sm text-gray-400 text-center leading-relaxed"
                  >
                    Thanks — I'll get back to you shortly.
                  </motion.p>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
