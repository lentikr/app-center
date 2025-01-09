import AppCard from '@/components/AppCard'
import { getApps } from '@/config/apps'
// import { headers } from 'next/headers'

export default async function Home() {
  // // 获取请求头中的主机名
  // const headersList = await headers();
  // const host = headersList.get('host') || '';
  // // 移除端口号，只保留域名或IP
  // const hostname = host.split(':')[0];

  // const apps = getApps(hostname);
  const apps = getApps();
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-12">应用中心</h1>

        <div className="flex flex-wrap justify-center gap-6">
          {apps.map(app => (
            <div key={app.id} className="w-[280px]">
              <AppCard {...app} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}