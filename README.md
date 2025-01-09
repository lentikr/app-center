# 应用中心

基于 Next.js 15 构建的 Web App，包含以下功能：

- 车费报销计算器
- MobaXterm KeyGen
- ...

## 项目特点

### 1. 智能路由系统
- 基于 Next.js App Router 实现的动态路由
- 每个应用都有独立的路由和布局配置
- 支持动态 favicon 切换，增强用户体验

### 2. 组件化设计
- 应用卡片组件（AppGrid）实现灵活的应用展示
- 可复用的输入组件和日期选择器
- 统一的错误提示和状态管理

### 3. 响应式布局
- 自适应网格布局，支持多种屏幕尺寸
- 卡片式设计，清晰展示应用
- 优雅的间距和阴影效果

### 4. 性能优化
- 组件级别的代码分割
- 路由级别的懒加载
- 静态资源优化

### 5. 部署灵活
- 支持 Node.js 动态服务器部署
- 支持 Docker 容器化部署

## 技术栈

- [Next.js 15](https://nextjs.org/docs/app/getting-started)
- [React 19](https://react.dev/reference/react)
- [Tailwind CSS](https://tailwindcss.com/docs/installation)
- [TypeScript](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)
- [Docker](https://docs.docker.com/get-docker/)

## 开发环境

- Node.js 22.13.0(LTS)
- npm 10.9.2

## 开始使用

```bash
# 克隆项目
git clone https://github.com/lentikr/app-center.git
cd app-center

# 本地运行
## 安装依赖
npm install

## 开发环境运行
npm run dev

## 构建并运行生产版本
npm run build
npm run start

# docker运行
sudo docker-compose build
sudo docker-compose up -d
```

访问 http://localhost:3000 即可