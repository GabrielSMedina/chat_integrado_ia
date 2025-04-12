# Etapa de build
FROM node:20-alpine AS builder

# Adicione ARG para as variáveis necessárias durante o build
ARG OPENAI_API_KEY
ARG NODE_ENV=production

WORKDIR /app
COPY . .
# Configure as variáveis de ambiente para o build
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV NODE_ENV=$NODE_ENV
RUN npm install
RUN npm run build

# Etapa final
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app ./
ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
