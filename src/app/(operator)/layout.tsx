import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { OperatorNav } from '@/components/operator/OperatorNav'

export default async function OperatorLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <OperatorNav user={session.user} />
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}


