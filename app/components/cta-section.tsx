'use client'

import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative p-10 sm:p-16 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23ffffff fill-opacity=0.05%3E%3Cpath d=M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Siap Meningkatkan Produktivitas?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
              Bergabung dengan 10.000+ pengguna yang sudah merasakan manfaat manajemen tugas yang tenang dan teratur.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-blue-700 bg-white rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 transition-all duration-200 shadow-lg"
              >
                Mulai Gratis Sekarang →
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700 transition-all duration-200"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}