'use client'

import { Navigation } from './components/landing-sections'
import { Hero } from './components/landing-sections'
import { FeatureCard } from './components/feature-card'
import { features } from './components/data'
import { PricingSection } from './components/pricing-section'
import { TestimonialsSection } from './components/testimonials-section'
import { CTASection } from './components/cta-section'
import { Footer } from './components/footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navigation />
      <Hero />
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              Semua yang Butuh untuk{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Produktif
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Fitur-fitur powerful yang dirancang sederhana. Tidak ada kompleksitas yang tidak perlu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  )
}