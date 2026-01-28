import './StatusBar.css'

export default function StatusBar() {
  return (
    <div className="status-bar">
      <span className="status-time">9:41</span>
      <div className="status-notch"></div>
      <div className="status-icons">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <path d="M1 4C1 3.44772 1.44772 3 2 3H3C3.55228 3 4 3.44772 4 4V8C4 8.55228 3.55228 9 3 9H2C1.44772 9 1 8.55228 1 8V4Z" fill="white"/>
          <path d="M6 3C6 2.44772 6.44772 2 7 2H8C8.55228 2 9 2.44772 9 3V9C9 9.55228 8.55228 10 8 10H7C6.44772 10 6 9.55228 6 9V3Z" fill="white"/>
          <path d="M11 2C11 1.44772 11.4477 1 12 1H13C13.5523 1 14 1.44772 14 2V10C14 10.5523 13.5523 11 13 11H12C11.4477 11 11 10.5523 11 10V2Z" fill="white"/>
          <path d="M16 1C16 0.447715 16.4477 0 17 0H17C17.5523 0 18 0.447715 18 1V11C18 11.5523 17.5523 12 17 12H17C16.4477 12 16 11.5523 16 11V1Z" fill="white" fillOpacity="0.3"/>
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <path d="M8.5 2.5C10.45 2.5 12.2 3.3 13.5 4.55L14.9 3.15C13.2 1.55 11 0.5 8.5 0.5C6 0.5 3.8 1.55 2.1 3.15L3.5 4.55C4.8 3.3 6.55 2.5 8.5 2.5ZM5.35 6.4L8.5 9.5L11.65 6.4C10.8 5.55 9.7 5 8.5 5C7.3 5 6.2 5.55 5.35 6.4Z" fill="white"/>
        </svg>
        <div className="battery-container">
          <div className="battery-icon">
            <div className="battery-level"></div>
          </div>
          <div className="battery-cap"></div>
        </div>
      </div>
    </div>
  )
}
