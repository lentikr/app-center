import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '报销计算器',
    icons: {
      icon: { url: '/icons/taxi.svg?v=' + Date.now(), type: 'image/svg+xml' }
    }
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function TaxiCalcLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
