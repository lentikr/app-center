export interface AppInfo {
  id: string
  icon: string
  title: string
  description: string
  href: string
}

export function getApps() {
  // 获取基础域名
  // const baseUrl = hostname || 'localhost';

  return [
    {
      id: 'calculator',
      icon: '/icons/taxi.svg',
      title: '报销计算器',
      description: '根据所提供的出租车发票金额，计算出最合理的报销部分',
      href: '/taxi_calc'  // 内部路由
    },
    {
      id: 'mobaxterm',
      icon: '/icons/mobaxterm.svg',
      title: 'Mobaxterm激活',
      description: 'Mobaxterm激活文件生成工具',
      href: '/moba'  // 内部路由
    },
    {
      id: 'fdrive',
      icon: '/icons/fdrive.svg',
      title: 'Fdrive',
      description: '基于Cloudflare R2的webdav服务',
      href: 'https://fdrive.lentikr.top'
    },
    {
      id: 'secf',
      icon: '/icons/secf.svg',
      title: 'SecF',
      description: '基于Cloudflare KV存储的文本文件公共访问服务',
      href: 'https://secf.lentikr.top'
    },
    {
      id: 'moontv',
      icon: '/icons/moontv.png',
      title: 'MoonTV',
      description: '一个开箱即用的、跨平台的影视聚合播放器',
      href: 'https://moon.lentikr.top'
    },
    {
      id: 'moemail',
      icon: '/icons/moemail.png',
      title: 'MoeMail',
      description: '一个基于 NextJS + Cloudflare 技术栈构建的可爱临时邮箱服务',
      href: 'https://moemail.lentikr.top'
    },
    {
      id: 'hajimi',
      icon: '/icons/hajimi.svg',
      title: 'Hajimi',
      description: '一个基于 FastAPI 构建的 Gemini API 代理',
      href: 'https://hajimi.lentikr.top'
    }
  ].sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
}
