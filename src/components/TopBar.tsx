import { AnimatePresence, motion } from 'framer-motion'
import './TopBar.css'

interface TopBarProps {
  title: string
  subtitle?: string
  onClose: () => void
  rightAction?: React.ReactNode
}

export default function TopBar({ title, subtitle, onClose, rightAction }: TopBarProps) {
  return (
    <div className="top-bar">
      <button className="close-button" onClick={onClose} aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="top-bar-title-container">
        <span className="top-bar-title">{title}</span>
        <AnimatePresence>
          {subtitle && (
            <motion.span
              className="top-bar-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {subtitle}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="top-bar-right">
        {rightAction}
      </div>
    </div>
  )
}
