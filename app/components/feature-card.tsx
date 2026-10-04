'use client'

import { Icons } from './icons'

interface FeatureCardProps {
  feature: {
    icon: () => string
    title: string
    description: string
  }
  index: number
}

export function FeatureCard({ feature, index }: FeatureCardProps) {
  return (
    <div
      className="group p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg transition-all duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300 text-2xl">
        {feature.icon()}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
    </div>
  )
}