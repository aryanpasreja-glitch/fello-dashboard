import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fello Dashboard',
  description: 'Real-time dashboard powered by Fello',
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

