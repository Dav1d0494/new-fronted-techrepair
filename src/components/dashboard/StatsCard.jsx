import React from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Card from '@components/ui/Card'

/**
 * StatsCard - Tarjeta de estadísticas
 */
export function StatsCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  trend,
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          {change && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Icon className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
        )}
      </div>

      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full -mr-10 -mt-10 opacity-50" />
    </Card>
  )
}

export default StatsCard
