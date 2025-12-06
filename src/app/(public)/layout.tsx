import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export default function PublicLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-serif text-xl font-semibold text-slate-900">A Case A Day</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/cases" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Cases
              </Link>
              <Link href="/concepts" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                Concepts
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-amber-500 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="font-serif text-lg font-semibold text-slate-900">A Case A Day</span>
            </div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} A Case A Day. Making business education timely and accessible.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

