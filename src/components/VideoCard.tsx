import { useRef, useState, useEffect } from 'react'
import { Clip } from '../types'
import './VideoCard.css'

interface VideoCardProps {
  clip: Clip
  isActive?: boolean
}

export default function VideoCard({ clip, isActive = false }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Handle play/pause toggle on click
  const handleVideoClick = () => {
    if (!videoRef.current) return
    
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
  }

  // Pause when card becomes inactive
  useEffect(() => {
    if (!isActive && videoRef.current && isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [isActive, isPlaying])

  // Update time as video plays
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  // Set duration when metadata loads
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  // Handle play/pause events
  const handlePlay = () => setIsPlaying(true)
  const handlePause = () => setIsPlaying(false)

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className={`video-card ${isActive ? 'active' : ''}`}>
      <div className="video-container" onClick={handleVideoClick}>
        <video
          ref={videoRef}
          className="video-player"
          src={clip.videoUrl}
          poster={clip.thumbnailUrl}
          playsInline
          loop
          muted={false}
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={handlePlay}
          onPause={handlePause}
        />
        
        {/* Play/Pause indicator */}
        {!isPlaying && (
          <div className="play-indicator">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.5)" />
              <path d="M20 16L32 24L20 32V16Z" fill="white" />
            </svg>
          </div>
        )}
        
        {/* Video controls - overlaid on video */}
        <div className="video-controls">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="time-display">
            <span>{formatTime(currentTime)}</span>
            <span className="time-separator">/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      
      {/* Caption below video */}
      <div className="caption-below">
        <p className="transcript-text">{clip.transcript}</p>
      </div>
    </div>
  )
}
