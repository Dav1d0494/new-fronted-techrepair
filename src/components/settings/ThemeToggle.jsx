import React, { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@hooks/useTheme'
import Button from '@components/ui/Button'

/**
 * ThemeToggle - Botón para cambiar tema
 */
export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="md"
      icon={isDark ? Sun : Moon}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    />
  )
}

export default ThemeToggle
