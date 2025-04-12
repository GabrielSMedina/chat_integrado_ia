# Etapa de build
FROM node:20-alpine AS builder

# Adicione ARG para as variáveis necessárias
ARG OPENAI_API_KEY
ARG NODE_ENV=production

WORKDIR /app

# 1. Copiar arquivos de configuração e dependências primeiro
COPY package.json package-lock.json* ./
COPY prisma ./prisma

# 2. Instalar dependências
RUN npm ci

# 3. Gerar Prisma Client
RUN npx prisma generate

# 4. Copiar o restante dos arquivos
COPY . .

# 5. Configurar ambiente e executar build
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV NODE_ENV=$NODE_ENV
RUN npm run build

# Etapa final
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json .
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]