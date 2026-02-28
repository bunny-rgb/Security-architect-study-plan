import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Security Architect Academy | Master CDN & WAF Security',
  description: 'Your journey from beginner to expert security architect. Master networking, CDN, WAF, and real-time incident handling.',
  manifest: '/manifest.json',
  themeColor: '#0a0a0f',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SecArch Academy',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen bg-dark-bg text-white antialiased">
        {children}
      </body>
    </html>
  )
}
