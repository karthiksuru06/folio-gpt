import React from 'react'
import { MotionConfig } from 'framer-motion'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/*
      reducedMotion="user" makes Framer Motion honour the OS setting for
      transform and layout animations. Without this the CSS media query in
      index.css only silences native CSS animations — every JS-driven
      stagger, hover-scale, and 3D tilt still plays at full motion.
    */}
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </React.StrictMode>,
)