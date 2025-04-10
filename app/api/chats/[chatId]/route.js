import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req, { params }) {
  const { chatId } = await params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
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

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }


  const { chatId } = await params;


  let body;
  try {
    body = await req.json();
  } catch (err) {
    return new Response("Body inválido", { status: 400 });
  }

  const { role, content } = body;

  if (!role || !content) {
    return new Response("Dados incompletos", { status: 400 });
  }

  try {
    const existingMessages = await prisma.message.count({
      where: { chatId },
    });

    const message = await prisma.message.create({
      data: {
        chatId,
        role,
        content,
        index: existingMessages,
      },
    });

    console.log("✅ Mensagem salva:", message);
    return NextResponse.json(message);
  } catch (err) {
    return new Response("Erro ao salvar mensagem", { status: 500 });
  }
}

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

    if (!response.ok) {
      throw new Error(`Erro ao chamar OpenAI: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
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

    return NextResponse.json({ responseText });
  } catch (error) {
    return new Response("Erro ao processar sua solicitação", { status: 500 });
  }
}
