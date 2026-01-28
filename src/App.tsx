import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import LockScreen from './screens/LockScreen'
import ClipsReviewScreen from './screens/ClipsReviewScreen'
import CaptionEditScreen from './screens/CaptionEditScreen'
import ShareDialog from './components/ShareDialog'
import { Clip } from './types'

// Real clips from the /clips folder
const sampleClips: Clip[] = [
  {
    id: '1',
    videoUrl: '/clips/riverside_sealing_my digital holes_meetings.mp4',
    thumbnailUrl: '/clips/riverside_sealing_my digital holes_meetings.jpg',
    duration: 0,
    caption: "Sealing my digital holes - one meeting at a time. The key to staying organized in a remote world 🔒 #RemoteWork #Productivity #Meetings",
    transcript: "SEALING MY DIGITAL HOLES"
  },
  {
    id: '2',
    videoUrl: "/clips/riverside_ai's_struggle with context_meetings.mp4",
    thumbnailUrl: "/clips/riverside_ai's_struggle with context_meetings.jpg",
    duration: 0,
    caption: "AI's biggest challenge? Understanding context. Here's what we've learned about working with AI tools 🤖 #AI #Technology #Context",
    transcript: "AI'S STRUGGLE WITH CONTEXT"
  },
  {
    id: '3',
    videoUrl: '/clips/riverside_john_adams_ keep it simple, stupid_meetings.mp4',
    thumbnailUrl: '/clips/riverside_john_adams_ keep it simple, stupid_meetings.jpg',
    duration: 0,
    caption: "John Adams knew it best: Keep it simple, stupid. The KISS principle applies to everything we do 💡 #Simplicity #KISS #Wisdom",
    transcript: "KEEP IT SIMPLE, STUPID"
  },
]

type Screen = 'lock-screen' | 'clips-review' | 'caption-edit'

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('lock-screen')
  const [selectedClipIndex, setSelectedClipIndex] = useState(0)
  const [editedCaption, setEditedCaption] = useState('')
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)

  const selectedClip = sampleClips[selectedClipIndex]

  const handleSelectClip = (index: number) => {
    setSelectedClipIndex(index)
  }

  const handleNext = () => {
    setEditedCaption(selectedClip.caption)
    setCurrentScreen('caption-edit')
    // Simulate processing (~40 seconds to complete)
    setProcessingProgress(0)
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Increment by ~0.75 on average (range 0-1.5) every 300ms = ~40 seconds total
        return prev + Math.random() * 1.5
      })
    }, 300)
  }

  const handleBack = () => {
    setCurrentScreen('clips-review')
    setProcessingProgress(0)
  }

  const handleOpenInReels = async () => {
    // Try Web Share API first (works on mobile browsers)
    if (navigator.share && navigator.canShare) {
      try {
        // Fetch the video file
        const response = await fetch(selectedClip.videoUrl)
        const blob = await response.blob()
        const file = new File([blob], 'riverside-clip.mp4', { type: 'video/mp4' })
        
        // Check if we can share files
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Share to Instagram Reels',
            text: editedCaption,
          })
          return // Successfully shared
        }
      } catch (err) {
        // User cancelled or share failed, fall through to dialog
        console.log('Web Share failed:', err)
      }
    }
    
    // Fall back to showing the dialog
    setShowShareDialog(true)
  }

  const handleCloseDialog = () => {
    setShowShareDialog(false)
  }

  const handleOpenInstagram = () => {
    setShowShareDialog(false)
    
    // Try to open Instagram app via deep link
    // This will open Instagram if installed, or go to App Store/Play Store
    const instagramUrl = 'instagram://app'
    const webFallback = 'https://www.instagram.com'
    
    // Create a hidden iframe to try the deep link
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = instagramUrl
    document.body.appendChild(iframe)
    
    // If Instagram doesn't open within 2 seconds, redirect to web
    setTimeout(() => {
      document.body.removeChild(iframe)
      // Check if we're still on the same page (Instagram didn't open)
      window.location.href = webFallback
    }, 2000)
  }

  const handleNotificationTap = () => {
    setCurrentScreen('clips-review')
  }

  const handleClose = () => {
    // Reset to initial state (lock screen)
    setCurrentScreen('lock-screen')
    setSelectedClipIndex(0)
    setProcessingProgress(0)
    setShowShareDialog(false)
  }

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {currentScreen === 'lock-screen' && (
          <LockScreen
            key="lock-screen"
            onNotificationTap={handleNotificationTap}
          />
        )}
        {currentScreen === 'clips-review' && (
          <ClipsReviewScreen
            key="clips-review"
            clips={sampleClips}
            selectedIndex={selectedClipIndex}
            onSelectClip={handleSelectClip}
            onNext={handleNext}
            onClose={handleClose}
          />
        )}
        {currentScreen === 'caption-edit' && (
          <CaptionEditScreen
            key="caption-edit"
            clip={selectedClip}
            caption={editedCaption}
            onCaptionChange={setEditedCaption}
            processingProgress={processingProgress}
            onBack={handleBack}
            onOpenInReels={handleOpenInReels}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
      
      <ShareDialog
        isOpen={showShareDialog}
        onClose={handleCloseDialog}
        onOpen={handleOpenInstagram}
      />
    </div>
  )
}

export default App
