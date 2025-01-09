import Link from 'next/link'
import Image from 'next/image'

interface AppCardProps {
  icon: string
  title: string
  description: string
  href: string
}

export default function AppCard({ icon, title, description, href }: AppCardProps) {
  return (
    <Link href={href} className="block no-underline group h-full">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-5
        transform hover:-translate-y-1 hover:border-blue-100 border border-gray-100
        h-full flex flex-col justify-between min-h-[200px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 flex items-center justify-center bg-blue-50 rounded-full
            transform transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-100">
            <div className="w-7 h-7 relative">
              <Image
                src={icon}
                alt={title}
                fill
                className="object-contain transition-transform group-hover:scale-110"
              />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-800 transition-colors duration-300
            group-hover:text-blue-600 text-center">
            {title}
          </h2>

          <p className="text-gray-600 text-center text-sm leading-relaxed
            transition-colors duration-300 group-hover:text-gray-700">
            {description}
          </p>
        </div>
      </div>
    </Link>
  )
}