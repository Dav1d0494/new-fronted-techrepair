import React from 'react'

/**
 * Componente Card reutilizable
 */
export function Card({
  children,
  className = '',
  hover = true,
  padding = 'p-6',
  onClick,
}) {
  return (
    <div
      className={`
        bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700
        shadow-sm transition-all duration-200
        ${hover ? 'hover:shadow-md hover:border-gray-300 dark:hover:border-slate-600' : ''}
        ${padding}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card
