import type { Metadata } from 'next'
import { DM_Sans, Fraunces, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap'
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'A Case A Day | MBA Case Studies from Breaking News',
  description: 'Transform current business events into publication-quality MBA case studies. Daily learning opportunities that keep business education relevant, engaging, and accessible.',
  keywords: ['MBA', 'case studies', 'business education', 'learning', 'strategy', 'finance']
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
