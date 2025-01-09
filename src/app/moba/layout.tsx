import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'MobaXterm KeyGen',
    icons: {
      icon: { url: '/icons/mobaxterm.svg?v=' + Date.now(), type: 'image/svg+xml' }
    }
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function MobaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
