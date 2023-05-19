import { ReactNode } from 'react'
import { Metadata } from 'next/types'
import {
  Roboto_Flex as Roboto,
  Bai_Jamjuree as BaiJamjuree,
} from 'next/font/google'
import './globals.css'

interface RootLayoutProps {
  children: ReactNode
}

export const metadata: Metadata = {
  title: 'NLW Spacetime | Time Capsule',
  description:
    'An application to save memories, developed during NLW Spacetime.',
}

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
})

const baiJamjuree = BaiJamjuree({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-bai-jamjuree',
})

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-br">
      <body
        className={`${roboto.variable} ${baiJamjuree.variable} bg-gray-900 font-sans text-gray-100`}
      >
        {children}
      </body>
    </html>
  )
}
