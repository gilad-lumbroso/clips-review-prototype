import { motion } from 'framer-motion'
import { useRef, useEffect, useState, useCallback } from 'react'
import TopBar from '../components/TopBar'
import VideoCard from '../components/VideoCard'
import { Clip } from '../types'
import './ClipsReviewScreen.css'

interface ClipsReviewScreenProps {
  clips: Clip[]
  selectedIndex: number
  onSelectClip: (index: number) => void
  onNext: () => void
  onClose: () => void
}

export default function ClipsReviewScreen({
  clips,
  selectedIndex,
  onSelectClip,
  onNext,
  onClose
}: ClipsReviewScreenProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<number | null>(null)
  
  // Mouse drag state
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const scrollStartX = useRef(0)
  const DRAG_THRESHOLD = 8 // pixels - only count as drag if moved more than this

  // Opacity for each item based on scroll position
  const [itemOpacities, setItemOpacities] = useState<number[]>(clips.map((_, i) => i === selectedIndex ? 1 : 0.2))
  
  // Horizontal padding to center first/last items
  const [sidePadding, setSidePadding] = useState(0)

  // Calculate opacities based on scroll position
  const updateOpacities = useCallback(() => {
    if (!carouselRef.current) return
    
    const container = carouselRef.current
    const containerWidth = container.offsetWidth
    const scrollLeft = container.scrollLeft
    const centerPoint = scrollLeft + containerWidth / 2
    
    // Get actual carousel items (skip padding spacers)
    const items = Array.from(container.querySelectorAll('.carousel-item'))
    
    const newOpacities = items.map((item) => {
      const el = item as HTMLElement
      const itemCenter = el.offsetLeft + el.offsetWidth / 2
      const distance = Math.abs(centerPoint - itemCenter)
      const itemWidth = el.offsetWidth
      
      // Full opacity when centered, fade to 0.2 as it moves away
      // Use item width as the reference for how fast to fade
      const normalizedDistance = Math.min(distance / itemWidth, 1)
      const opacity = 1 - (normalizedDistance * 0.8) // 1 -> 0.2
      
      return Math.max(0.2, opacity)
    })
    
    setItemOpacities(newOpacities)
  }, [])

  // Calculate side padding for centering first/last items
  const updatePadding = useCallback(() => {
    if (!carouselRef.current) return
    
    const container = carouselRef.current
    const containerWidth = container.offsetWidth
    const firstItem = container.querySelector('.carousel-item') as HTMLElement
    
    if (firstItem) {
      const itemWidth = firstItem.offsetWidth
      // Padding = half the container minus half the item width
      const padding = Math.max(0, (containerWidth - itemWidth) / 2)
      setSidePadding(padding)
    }
  }, [])

  // Update padding and opacities on mount, resize, and when clips change
  useEffect(() => {
    updatePadding()
    // Small delay to let layout settle, then update opacities
    const timer = setTimeout(() => {
      updateOpacities()
    }, 50)
    
    const handleResize = () => {
      updatePadding()
      updateOpacities()
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timer)
    }
  }, [updatePadding, updateOpacities, clips])

  // Scroll to selected clip when selectedIndex changes (e.g., from dot click)
  useEffect(() => {
    if (carouselRef.current && !isScrollingRef.current && !isMouseDown) {
      const container = carouselRef.current
      const items = container.querySelectorAll('.carousel-item')
      if (items[selectedIndex]) {
        const item = items[selectedIndex] as HTMLElement
        const containerWidth = container.offsetWidth
        const itemLeft = item.offsetLeft
        const itemWidth = item.offsetWidth
        // Center the item in the container
        const scrollTo = itemLeft - (containerWidth - itemWidth) / 2
        container.scrollTo({
          left: scrollTo,
          behavior: 'smooth'
        })
      }
    }
  }, [selectedIndex, isMouseDown])

  // Handle scroll to update opacities and detect which clip is centered
  const handleScroll = () => {
    // Update opacities on every scroll frame
    updateOpacities()
    
    if (isDragging) return
    
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    isScrollingRef.current = true

    // Debounce: wait for scroll to stop
    scrollTimeoutRef.current = window.setTimeout(() => {
      isScrollingRef.current = false
      
      if (carouselRef.current) {
        const container = carouselRef.current
        const containerWidth = container.offsetWidth
        const scrollLeft = container.scrollLeft
        const centerPoint = scrollLeft + containerWidth / 2

        // Find which item is closest to center
        let closestIndex = 0
        let closestDistance = Infinity

        Array.from(container.children).forEach((child, index) => {
          const item = child as HTMLElement
          const itemCenter = item.offsetLeft + item.offsetWidth / 2
          const distance = Math.abs(centerPoint - itemCenter)
          if (distance < closestDistance) {
            closestDistance = distance
            closestIndex = index
          }
        })

        if (closestIndex !== selectedIndex) {
          onSelectClip(closestIndex)
        }
      }
    }, 100)
  }

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return
    setIsMouseDown(true)
    setIsDragging(false)
    dragStartX.current = e.clientX
    scrollStartX.current = carouselRef.current.scrollLeft
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !carouselRef.current) return
    
    const deltaX = e.clientX - dragStartX.current
    
    // Only start actual dragging after threshold
    if (Math.abs(deltaX) > DRAG_THRESHOLD && !isDragging) {
      setIsDragging(true)
      carouselRef.current.style.scrollSnapType = 'none'
    }
    
    if (isDragging || Math.abs(deltaX) > DRAG_THRESHOLD) {
      e.preventDefault()
      carouselRef.current.scrollLeft = scrollStartX.current - deltaX
    }
  }

  const handleMouseUp = () => {
    if (!carouselRef.current) return
    
    const wasDragging = isDragging
    
    setIsMouseDown(false)
    setIsDragging(false)
    carouselRef.current.style.scrollSnapType = 'x mandatory'
    
    // Only snap if we actually dragged
    if (wasDragging) {
      snapToNearestClip()
    }
  }

  const handleMouseLeave = () => {
    if (isMouseDown) {
      handleMouseUp()
    }
  }

  const snapToNearestClip = () => {
    if (!carouselRef.current) return
    
    const container = carouselRef.current
    const containerWidth = container.offsetWidth
    const scrollLeft = container.scrollLeft
    const centerPoint = scrollLeft + containerWidth / 2

    let closestIndex = 0
    let closestDistance = Infinity

    Array.from(container.children).forEach((child, index) => {
      const item = child as HTMLElement
      const itemCenter = item.offsetLeft + item.offsetWidth / 2
      const distance = Math.abs(centerPoint - itemCenter)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    // Scroll to the closest clip
    const targetItem = container.children[closestIndex] as HTMLElement
    const scrollTo = targetItem.offsetLeft - (containerWidth - targetItem.offsetWidth) / 2
    container.scrollTo({
      left: scrollTo,
      behavior: 'smooth'
    })

    if (closestIndex !== selectedIndex) {
      onSelectClip(closestIndex)
    }
  }

  return (
    <motion.div
      className="clips-review-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <TopBar
        title="Clips ready to share"
        subtitle="Choose which to post"
        onClose={onClose}
      />

      <div className="carousel-container">
        <div
          ref={carouselRef}
          className={`clips-carousel ${isDragging ? 'dragging' : ''}`}
          style={{ paddingLeft: sidePadding, paddingRight: sidePadding }}
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {clips.map((clip, index) => (
            <div
              key={clip.id}
              className="carousel-item"
              style={{ opacity: itemOpacities[index] ?? 0.2 }}
            >
              <VideoCard clip={clip} isActive={index === selectedIndex} />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="pagination-dots">
        {clips.map((_, index) => (
          <button
            key={index}
            className={`pagination-dot ${index === selectedIndex ? 'active' : ''}`}
            onClick={() => onSelectClip(index)}
            aria-label={`Go to clip ${index + 1}`}
          />
        ))}
      </div>

      {/* Bottom action bar */}
      <div className="bottom-action-bar">
        <button className="edit-button" aria-label="Edit clip">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 4L8.5 15.5M8.5 8.5L20 20M6 3C7.65685 3 9 4.34315 9 6C9 7.65685 7.65685 9 6 9C4.34315 9 3 7.65685 3 6C3 4.34315 4.34315 3 6 3ZM6 15C7.65685 15 9 16.3431 9 18C9 19.6569 7.65685 21 6 21C4.34315 21 3 19.6569 3 18C3 16.3431 4.34315 15 6 15Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="next-button" onClick={onNext}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Next</span>
        </button>
      </div>

      {/* Home indicator */}
      <div className="home-indicator">
        <div className="home-indicator-bar" />
      </div>
    </motion.div>
  )
}
