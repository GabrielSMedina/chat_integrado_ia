# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Etapa final
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app ./
ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
