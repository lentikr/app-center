import './globals.css'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '应用中心',
    icons: {
      icon: { url: '/icons/home.svg?v=' + Date.now(), type: 'image/svg+xml' }
    }
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body>{children}</body>
    </html>
  )
}