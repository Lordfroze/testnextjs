'use client'

import Link from 'next/link'
import { Icons } from './icons'
import { pricingPlans } from './data'

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
            Harga yang {' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transparan
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Pilih paket yang cocok untuk Anda. Semua paket mencakup uji coba gratis 14 hari. Tanpa kartu kredit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                plan.popular
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-xl shadow-blue-500/10'
                  : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                  Paling Populer
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="flex-shrink-0 mt-0.5 text-green-500">✓</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/login"
                className={`block w-full text-center py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <details className="group border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
              <span className="font-medium text-gray-900 dark:text-white">Apakah saya bisa mengganti paket nanti?</span>
              <span className="text-gray-400 group-open:rotate-90 transition-transform">›</span>
            </summary>
            <div className="px-5 pb-5 text-gray-600 dark:text-gray-300 text-sm border-t border-gray-200 dark:border-gray-800">
              Ya, Anda bisa upgrade atau downgrade kapan saja. Perubahan akan berlaku di siklus penagihan berikutnya.
            </div>
          </details>
          <details className="group border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mt-2">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
              <span className="font-medium text-gray-900 dark:text-white">Apa yang terjadi setelah uji coba 14 hari berakhir?</span>
              <span className="text-gray-400 group-open:rotate-90 transition-transform">›</span>
            </summary>
            <div className="px-5 pb-5 text-gray-600 dark:text-gray-300 text-sm border-t border-gray-200 dark:border-gray-800">
              Akun Anda akan otomatis beralih ke paket Gratis. Data Anda tetap utuh, tanpa kehilangan fitur apa pun.
            </div>
          </details>
          <details className="group border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mt-2">
            <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
              <span className="font-medium text-gray-900 dark:text-white">Apakah data saya aman?</span>
              <span className="text-gray-400 group-open:rotate-90 transition-transform">›</span>
            </summary>
            <div className="px-5 pb-5 text-gray-600 dark:text-gray-300 text-sm border-t border-gray-200 dark:border-gray-800">
              Ya. Kami menggunakan enkripsi AES-256, autentikasi JWT, dan server terlindungi SOC2. Data Anda tidak dijual ke pihak ketiga.
            </div>
          </details>
        </div>
      </div>
    </section>
  )
}