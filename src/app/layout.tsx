import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

import { Toaster } from '@/components/ui/toaster'

const fontSans = FontSans({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Sua FATEC',
  description:
    'Site para estudantes encontrarem sua FATEC. Diversas informações sobre as FATECs do estado de Sao Paulo e seus cursos.',
  icons: 'favicon.png',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='pt-BR'>
      <body className={cn('font-sans antialiased', fontSans.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
