import NextAuthProvider from '@/components/NextAuthProvider'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Resume Analyzer 2.0',
  description: 'AI-powered resume optimization for CS students.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-slate-950 text-slate-100">
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  )
}
