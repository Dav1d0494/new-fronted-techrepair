import React, { useState } from 'react'

/**
 * Componente Tabs reutilizable
 */
export function Tabs({ children, defaultValue }) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <div>
      {React.Children.map(children, child => {
        if (child.type === TabsList) {
          return React.cloneElement(child, { activeTab, setActiveTab })
        }
        return child
      })}
      {React.Children.map(children, child => {
        if (child.type === TabsContent) {
          return React.cloneElement(child, { activeTab })
        }
      })}
    </div>
  )
}

export function TabsList({ children, activeTab, setActiveTab }) {
  return (
    <div className="flex border-b border-gray-200 dark:border-slate-700">
      {React.Children.map(children, child => {
        if (child.type === TabsTrigger) {
          return React.cloneElement(child, { activeTab, setActiveTab })
        }
      })}
    </div>
  )
}

export function TabsTrigger({ children, value, activeTab, setActiveTab }) {
  const isActive = activeTab === value

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`
        pb-4 px-4 border-b-2 font-medium transition-colors
        ${isActive
          ? 'border-purple-600 text-purple-600'
          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
        }
      `}
    >
      {children}
    </button>
  )
}

export function TabsContent({ children, value, activeTab }) {
  if (activeTab !== value) return null
  return children
}

export default Tabs
