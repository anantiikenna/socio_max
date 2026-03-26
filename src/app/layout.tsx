import type { Metadata } from 'next'
import './globals.css'
import QueryProvider from '@/components/providers/QueryProvider'

export const metadata: Metadata = {
  title: 'Socio Max',
  description: 'Share moments with the world.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  )
}
