import React, { useEffect, useState } from 'react'

export default function OnlineIndicator() {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    function goOnline() { setOnline(true) }
    function goOffline() { setOnline(false) }

    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  return (
    <div className={`online-indicator ${online ? 'online' : 'offline'}`} title={online ? 'Online' : 'Offline'}>
      <span className="dot" />
      <span className="label">{online ? 'Online' : 'Offline'}</span>
    </div>
  )
}