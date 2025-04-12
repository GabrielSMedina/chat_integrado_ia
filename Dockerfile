# Etapa de build
FROM node:20-alpine AS builder

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

WORKDIR /app

# Copia arquivos necessários para instalar dependências
COPY package.json package-lock.json* ./

# Instala dependências com travamento de versão
RUN npm ci


# Copia os arquivos restantes do projeto
COPY . .

RUN npx prisma generate


# Executa o build da aplicação
RUN npm run build

# Etapa final: apenas com o necessário para rodar em produção
FROM node:20-alpine

ENV NODE_ENV=production
WORKDIR /app

# Copia o app já compilado
COPY --from=builder /app ./

# Expõe a porta usada pela aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
