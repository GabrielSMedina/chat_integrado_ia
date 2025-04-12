# Etapa de build
FROM node:20-alpine AS builder

# Adicione ARG para as variáveis necessárias
ARG NODE_ENV=production

WORKDIR /app

# Primeiro copie apenas os arquivos necessários para instalação
COPY package.json package-lock.json* ./
RUN npm install --include=dev

# Depois copie o restante dos arquivos
COPY . .

# Configure as variáveis de ambiente
ENV NODE_ENV=$NODE_ENV

# Instale explicitamente o TailwindCSS e dependências
RUN npm install @tailwindcss/postcss postcss autoprefixer

# Execute o build
RUN npm run build

# Etapa final
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app ./
ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
