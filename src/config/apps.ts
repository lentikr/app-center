export interface AppInfo {
  id: string
  icon: string
  title: string
  description: string
  href: string
}

// 定义外部应用的端口映射
// const externalPorts = {
//   alist: '5244',
//   memos: '5230',
//   portainer: '9443'
// } as const;

// 定义应用配置生成函数
// export function getApps(hostname: string = '') {
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
    // {
    //   id: 'alist',
    //   icon: '/icons/cloud.svg',
    //   title: 'Alist',
    //   description: '一个支持多种存储的文件列表程序，使用 Gin 和 Solidjs 驱动',
    //   href: `http://${baseUrl}:${externalPorts.alist}`
    // },
    // {
    //   id: 'memos',
    //   icon: '/icons/memos.svg',
    //   title: 'Memos',
    //   description: '一个开源轻量级的笔记解决方案',
    //   href: `http://${baseUrl}:${externalPorts.memos}`
    // },
    {
      id: 'mobaxterm',
      icon: '/icons/mobaxterm.svg',
      title: 'Mobaxterm激活',
      description: 'Mobaxterm激活文件生成工具',
      href: '/moba'  // 内部路由
    },
    // {
    //   id: 'portainer',
    //   icon: '/icons/portainer.svg',
    //   title: 'Portainer',
    //   description: '让 Docker 和 Kubernetes 的管理变得简单',
    //   href: `https://${baseUrl}:${externalPorts.portainer}`  // 注意这里使用 https
    // }
  ].sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
}