from pathlib import Path

readme_content = """
# 💬 Chat Integrado com IA

Este projeto é uma aplicação **fullstack com Next.js e React** que implementa um chat integrado à API da OpenAI. Inclui autenticação via Google, persistência de conversas, exclusão de chats e histórico acessível, além de possuir a exibião do texto em stream, fazendo assim que o texto seja entregue em tempo real de produção. Além disso, cobre **todas as etapas do desenvolvimento ao deploy automatizado**, incluindo integração contínua com GitHub Actions, deploy no Google Cloud Run e banco de dados no Cloud SQL.

---

## 🚀 Funcionalidades

- Login com Google (via NextAuth)
- Integração com a API da OpenAI para respostas inteligentes
- Persistência de conversas organizadas por `chatID`
- Exclusão completa de chats
- Histórico de chats acessível
- estes unitários executados automaticamente via GitHub Actions
- Deploy contínuo (CI/CD) para Google Cloud Run
- Stream de mensagens

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React.js](https://reactjs.org/)
- **Framework Fullstack:** [Next.js (App Router)](https://nextjs.org/)
- **Autenticação:** [NextAuth.js](https://next-auth.js.org/) com Google Provider
- **Backend:** API Routes do Next.js + integração com [OpenAI](https://platform.openai.com/)
- **Banco de Dados:** [Prisma ORM](https://www.prisma.io/) com MySQL no Google Cloud SQL
- **Deploy:** [Docker](https://www.docker.com/), [Google Cloud Run](https://cloud.google.com/run)
- **CI/CD:** [GitHub Actions](https://github.com/features/actions)
- **Testes:** [Vitest](https://vitest.dev/)

---

## Deploy Automatizado (CI/CD)
Este projeto utiliza CI/CD com GitHub Actions:
- CI: Executa testes a cada push
- CD: Faz deploy para o Cloud Run ao push na branch main
- Banco de dados: Utiliza instância MySQL no Google Cloud SQL

Você pode configurar sua própria infraestrutura no Google Cloud, e usar secrets no GitHub para armazenar as credenciais necessárias (Google Service Account, URLs, chaves de API, etc).
