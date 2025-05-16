import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Memory Match - Rick and Morty',
  description: 'A Memory Match inspired by Rick and Morty',
  icons: {
    icon: '/images/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
