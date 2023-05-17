import { ReactNode } from 'react'
import { Metadata } from 'next/types'
import { Inter } from 'next/font/google'
import './globals.css'

interface RootLayoutProps {
  children: ReactNode
}

export const metadata: Metadata = {
  title: 'NLW Spacetime | Time Capsule',
  description:
    'An application to save memories, developed during NLW Spacetime.',
}

const inter = Inter({
  subsets: ['latin'],
})

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
