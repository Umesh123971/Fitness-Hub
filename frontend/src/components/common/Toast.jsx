import React, { useState, useEffect } from 'react'

let showToastFunc = null

const Toast = () => {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    showToastFunc = (message, type = 'success') => {
      const id = Date.now()
      setToasts(prev => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
      }, 3000)
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-6 py-3 rounded-lg shadow-lg text-white ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' :
            'bg-blue-500'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}

export const showToast = (message, type) => {
  if (showToastFunc) {
    showToastFunc(message, type)
  }
}

export default Toast