import { motion } from 'framer-motion'
import './LockScreen.css'

interface LockScreenProps {
  onNotificationTap: () => void
}

export default function LockScreen({ onNotificationTap }: LockScreenProps) {
  return (
    <motion.div
      className="lock-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* iOS Wallpaper Background - Matching iOS 16 style */}
      <div className="lock-screen-wallpaper">
        <div className="wallpaper-shape wallpaper-shape-1" />
        <div className="wallpaper-shape wallpaper-shape-2" />
        <div className="wallpaper-shape wallpaper-shape-3" />
        <div className="wallpaper-shape wallpaper-shape-4" />
      </div>

      {/* iOS Status Bar */}
      <div className="lock-status-bar">
        <span className="lock-status-time">9:41</span>
        <div className="lock-status-icons">
          {/* Cellular - iOS style 4 bars */}
          <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
            <rect x="0" y="7" width="3" height="4" rx="0.5" fill="white"/>
            <rect x="4.5" y="5" width="3" height="6" rx="0.5" fill="white"/>
            <rect x="9" y="2.5" width="3" height="8.5" rx="0.5" fill="white"/>
            <rect x="13.5" y="0" width="3" height="11" rx="0.5" fill="white"/>
          </svg>
          {/* WiFi - iOS style */}
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M7.5 2.17C9.79 2.17 11.88 3.03 13.45 4.47L14.85 2.97C12.9 1.19 10.32 0.1 7.5 0.1C4.68 0.1 2.1 1.19 0.15 2.97L1.55 4.47C3.12 3.03 5.21 2.17 7.5 2.17ZM4.13 7.03C5.1 6.17 6.25 5.67 7.5 5.67C8.75 5.67 9.9 6.17 10.87 7.03L12.27 5.53C10.92 4.33 9.3 3.6 7.5 3.6C5.7 3.6 4.08 4.33 2.73 5.53L4.13 7.03ZM7.5 8.17C8.22 8.17 8.87 8.47 9.37 8.93L7.5 10.9L5.63 8.93C6.13 8.47 6.78 8.17 7.5 8.17Z" fill="white"/>
          </svg>
          {/* Battery - iOS style with border and cap */}
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="white" strokeOpacity="0.35"/>
            <rect x="2" y="2" width="18" height="8" rx="1.5" fill="white"/>
            <path d="M23 4V8C23.83 7.67 24.5 6.92 24.5 6C24.5 5.08 23.83 4.33 23 4Z" fill="white" fillOpacity="0.4"/>
          </svg>
        </div>
      </div>

      {/* Date & Time - iOS Lock Screen style */}
      <div className="lock-datetime">
        <p className="lock-date">Monday, June 6</p>
        <p className="lock-time">9:41</p>
      </div>

      {/* Notification Shadow */}
      <div className="notification-shadow" />

      {/* Push Notification */}
      <motion.div
        className="lock-notification-container"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.button
          className="lock-notification"
          onClick={onNotificationTap}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.1 }}
        >
          {/* App Icon - Using actual Riverside icon */}
          <div className="notification-app-icon">
            <img 
              src="/riverside-icon.png" 
              alt="Riverside" 
              className="notification-app-icon-img"
            />
          </div>

          {/* Notification Content */}
          <div className="notification-content">
            <p className="notification-title">
              Remember when you wanted to post more on social media?
            </p>
            <p className="notification-body">
              We made you a clip for that.
            </p>
          </div>
        </motion.button>
      </motion.div>

      {/* Home Indicator - iOS style */}
      <div className="lock-home-indicator">
        <div className="lock-home-indicator-bar" />
      </div>
    </motion.div>
  )
}
