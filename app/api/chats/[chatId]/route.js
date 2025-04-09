import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ajuste para o caminho correto do seu prisma
import { getServerSession } from 'next-auth'; // Se você estiver usando NextAuth
import { authOptions } from '@/lib/auth'; // Ajuste conforme a configuração do seu authOptions

// Função GET
export async function GET(req, { params }) {
  const { chatId } = await params; // Use await para garantir que os parâmetros sejam resolvidos corretamente

  // Verificar a sessão
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Buscar o chat com as mensagens
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { messages: true },
    });

    if (!chat) {
      return new Response("Chat não encontrado", { status: 404 });
    }

    return NextResponse.json(chat.messages); // Usando NextResponse para JSON
  } catch (error) {
    console.error("Erro ao buscar chat:", error);
    return new Response("Erro ao buscar chat", { status: 500 });
  }
}

// Função POST para salvar mensagem no chat
export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  console.log("➡️ POST /api/chats/[chatId] chamado");

  const { chatId } = await params; // Use await aqui para garantir que o chatId seja resolvido corretamente

  console.log("📎 params.chatId:", chatId);

  let body;
  try {
    body = await req.json();
    console.log("📨 Body recebido:", body);
  } catch (err) {
    console.error("❌ Erro ao fazer parsing do body:", err);
    return new Response("Body inválido", { status: 400 });
  }

  const { role, content } = body;

  if (!role || !content) {
    console.warn("⚠️ Role ou content ausente:", { role, content });
    return new Response("Dados incompletos", { status: 400 });
  }

  try {
    // Conta quantas mensagens já existem neste chat
    const existingMessages = await prisma.message.count({
      where: { chatId },
    });
    console.log("📊 Total de mensagens anteriores:", existingMessages);

    // Cria a nova mensagem
    const message = await prisma.message.create({
      data: {
        chatId,
        role,
        content,
        index: existingMessages, // define a ordem
      },
    });

    console.log("✅ Mensagem salva:", message);
    return NextResponse.json(message); // Usando NextResponse para retornar o JSON
  } catch (err) {
    console.error("❌ Erro ao salvar mensagem:", err);
    return new Response("Erro ao salvar mensagem", { status: 500 });
  }
}

// Função POST para gerar a resposta da OpenAI (renomeada para evitar conflito)
export async function generateOpenAIResponse(req) {
  try {
    const body = await req.json();
    const { prompt } = body;

    const response = await fetch("URL_DA_API_OPENAI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ prompt }),
    });

    // Verificar se a resposta da API da OpenAI foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro ao chamar OpenAI: ${response.statusText}`);
    }

    // Aguardar a resposta e processá-la
    const reader = response.body?.getReader(); // Verifique se response.body existe
    if (!reader) {
      throw new Error("Erro ao iniciar o streaming");
    }

    const decoder = new TextDecoder();
    let done = false;
    let responseText = '';

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      responseText += decoder.decode(value, { stream: true });
    }

    return NextResponse.json({ responseText }); // Retornar a resposta gerada
  } catch (error) {
    console.error("Erro ao chamar OpenAI:", error);
    return new Response("Erro ao processar sua solicitação", { status: 500 });
  }
}
