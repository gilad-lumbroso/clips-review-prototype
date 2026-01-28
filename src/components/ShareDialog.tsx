import { AnimatePresence, motion } from 'framer-motion'
import './ShareDialog.css'

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

export default function ShareDialog({ isOpen, onClose, onOpen }: ShareDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="dialog-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="share-dialog"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
          >
            <div className="dialog-content">
              <p className="dialog-title">"Riverside" wants to open "Instagram"</p>
            </div>
            <div className="dialog-actions">
              <button className="dialog-button dialog-button-cancel" onClick={onClose}>
                Cancel
              </button>
              <button className="dialog-button dialog-button-open" onClick={onOpen}>
                Open
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
