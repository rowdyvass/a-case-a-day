'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { BookOpen, LayoutDashboard, FileText, Plus, LogOut, ExternalLink, Wand2 } from 'lucide-react'

interface OperatorNavProps {
  user: {
    name?: string | null
    email?: string | null
  }
}

export function OperatorNav({ user }: OperatorNavProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/operator/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/operator/cases', label: 'Cases', icon: FileText },
    { href: '/operator/cases/new', label: 'New Case', icon: Plus },
    { href: '/operator/prompts', label: 'Prompts', icon: Wand2 }
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/operator/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-amber-400" />
              </div>
              <span className="font-serif text-lg font-semibold text-slate-900">Operator Portal</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || 
                  (item.href === '/operator/cases' && pathname.startsWith('/operator/cases') && pathname !== '/operator/cases/new')
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/cases"
              target="_blank"
              className="hidden sm:flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              View Site <ExternalLink className="h-3 w-3" />
            </Link>
            
            <div className="hidden sm:block text-sm text-slate-600">
              {user.name || user.email}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

