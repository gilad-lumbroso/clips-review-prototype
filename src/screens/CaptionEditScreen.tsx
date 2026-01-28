import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import TopBar from '../components/TopBar'
import { Clip } from '../types'
import './CaptionEditScreen.css'

interface CaptionEditScreenProps {
  clip: Clip
  caption: string
  onCaptionChange: (caption: string) => void
  processingProgress: number
  onBack: () => void
  onOpenInReels: () => void
  onClose: () => void
}

export default function CaptionEditScreen({
  clip,
  caption,
  onCaptionChange,
  processingProgress,
  onBack,
  onOpenInReels,
  onClose
}: CaptionEditScreenProps) {
  const [isEditing, setIsEditing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const isProcessing = processingProgress < 100

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isEditing])

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleEditCaption = () => {
    setIsEditing(true)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Video controls
  const handleVideoClick = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => setIsPlaying(false)

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0


  return (
    <motion.div
      className="caption-edit-screen"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.25 }}
    >
      <TopBar
        title="Add caption"
        subtitle={isProcessing ? "while clip renders" : undefined}
        onClose={onClose}
        rightAction={
          <button className="back-button" onClick={onBack} aria-label="Back">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        }
      />

      <div className="content-area">
        {/* Video preview with processing indicator */}
        <div className="video-preview-container">
          <div className="video-preview-wrapper">
            <div className="video-preview" onClick={handleVideoClick}>
              <video
                ref={videoRef}
                className="video-player-small"
                src={clip.videoUrl}
                poster={clip.thumbnailUrl}
                playsInline
                loop
                preload="auto"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={handlePlay}
                onPause={handlePause}
              />

              {/* Play indicator */}
              {!isPlaying && !isProcessing && (
                <div className="play-indicator-small">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="18" r="18" fill="rgba(0,0,0,0.5)" />
                    <path d="M15 12L24 18L15 24V12Z" fill="white" />
                  </svg>
                </div>
              )}

              {/* Processing overlay */}
              {isProcessing && (
                <div className="processing-overlay">
                  <div className="progress-ring">
                    <svg viewBox="0 0 80 80">
                      <circle
                        className="progress-ring-bg"
                        cx="40"
                        cy="40"
                        r="36"
                      />
                      <circle
                        className="progress-ring-fill"
                        cx="40"
                        cy="40"
                        r="36"
                        style={{
                          strokeDasharray: `${2 * Math.PI * 36}`,
                          strokeDashoffset: `${2 * Math.PI * 36 * (1 - processingProgress / 100)}`
                        }}
                      />
                    </svg>
                    <span className="progress-text">{Math.round(processingProgress)}%</span>
                  </div>
                </div>
              )}

              {/* Caption overlay when not processing */}
              {!isProcessing && (
                <div className="caption-overlay-preview">
                  <p className="transcript-text-preview">{clip.transcript}</p>
                </div>
              )}

              {/* Video controls - overlaid on video */}
              <div className="video-controls-small">
                <div className="progress-bar-small">
                  <div className="progress-fill-small" style={{ width: `${progress}%` }} />
                </div>
                <div className="time-display-small">
                  <span>{formatTime(currentTime)}</span>
                  <span className="time-separator">/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Caption editor */}
        <div className="caption-editor">
          {isEditing ? (
            <textarea
              ref={textareaRef}
              className="caption-textarea"
              value={caption}
              onChange={(e) => onCaptionChange(e.target.value)}
              onBlur={() => setIsEditing(false)}
              rows={4}
            />
          ) : (
            <div className="caption-display" onClick={handleEditCaption}>
              <p>{caption}</p>
            </div>
          )}
          <div className="caption-actions">
            <button className="caption-action-btn" onClick={handleCopyCaption} aria-label="Copy caption">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M5.33 5.33V3.33C5.33 2.6 5.93 2 6.67 2H12.67C13.4 2 14 2.6 14 3.33V9.33C14 10.07 13.4 10.67 12.67 10.67H10.67M3.33 5.33H9.33C10.07 5.33 10.67 5.93 10.67 6.67V12.67C10.67 13.4 10.07 14 9.33 14H3.33C2.6 14 2 13.4 2 12.67V6.67C2 5.93 2.6 5.33 3.33 5.33Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="caption-action-btn" onClick={handleEditCaption} aria-label="Edit caption">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M9 4L12 7M2.67 13.33H5.33L12.33 6.33C12.69 5.98 12.89 5.5 12.89 5C12.89 4.5 12.69 4.01 12.33 3.66C11.98 3.3 11.5 3.11 11 3.11C10.5 3.11 10.01 3.3 9.66 3.66L2.67 10.67V13.33Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="bottom-action-bar-caption">
        <button className="download-button" aria-label="Download clip">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button 
          className={`open-in-reels-button ${isProcessing ? 'disabled' : ''}`}
          onClick={onOpenInReels}
          disabled={isProcessing}
        >
          Open in Reels
        </button>
      </div>

      {/* Home indicator */}
      <div className="home-indicator">
        <div className="home-indicator-bar" />
      </div>
    </motion.div>
  )
}
