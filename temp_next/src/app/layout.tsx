import type { Metadata } from 'next'
import './globals.css'

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
      <body>{children}</body>
    </html>
  )
}
