import React, { useState } from 'react'

/**
 * Componente Tooltip reutilizable
 */
export function Tooltip({
  children,
  content,
  position = 'top',
  delay = 0,
}) {
  const [isVisible, setIsVisible] = useState(false)

  const positions = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  }

  const arrowPositions = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t border-l border-gray-900 dark:border-slate-700',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b border-r border-gray-900 dark:border-slate-700',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l border-b border-gray-900 dark:border-slate-700',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r border-t border-gray-900 dark:border-slate-700',
  }

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setTimeout(() => setIsVisible(true), delay)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      {isVisible && (
        <div
          className={`
            absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-slate-700
            rounded-lg whitespace-nowrap pointer-events-none
            ${positions[position]}
          `}
        >
          {content}
          <div
            className={`
              absolute w-0 h-0
              border-4 border-transparent
              ${arrowPositions[position]}
            `}
          />
        </div>
      )}
    </div>
  )
}

export default Tooltip
