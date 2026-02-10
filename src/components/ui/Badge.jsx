import React from 'react'

/**
 * Componente Badge reutilizable
 */
export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) {
  const variants = {
    primary: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200',
    secondary: 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200',
    success: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200',
    warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200',
    danger: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200',
    info: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200',
  }

  const sizes = {
    sm: 'px-2 py-1 text-xs font-medium',
    md: 'px-3 py-1 text-sm font-medium',
    lg: 'px-4 py-2 text-base font-medium',
  }

  return (
    <span
      className={`
        inline-flex items-center rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}

export default Badge
