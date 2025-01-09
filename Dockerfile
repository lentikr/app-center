# 构建阶段
FROM node:22.13.0-alpine

# 设置淘宝镜像源
RUN npm config set registry https://registry.npmmirror.com

WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --production

# 复制构建文件和静态资源
COPY .next ./.next
COPY public ./public

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]