import React from 'react'

/**
 * Componente Avatar para mostrar avatares de usuarios
 */
export function Avatar({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className = '',
  onClick,
}) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  const getInitials = (fullName) => {
    return fullName
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'
  }

  return (
    <div
      className={`
        relative inline-flex items-center justify-center rounded-full
        bg-purple-600 text-white font-bold
        ${sizes[size]}
        ${onClick ? 'cursor-pointer hover:ring-2 hover:ring-purple-400 transition-all' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        getInitials(name)
      )}
    </div>
  )
}

export default Avatar
