import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Nenhuma mensagem fornecida' }), { status: 400 });
    }

    // Chamando a API OpenAI com streaming ativado
    const stream = await openai.chat.completions.create({
      model: 'gpt-4', // Corrigi o nome do modelo (não existe "gpt-4o-mini")
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      stream: true,
    });

    // Cria um stream de resposta para o frontend
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(encoder.encode(content));
        }
        controller.close();
      },
    });

    // Retorna o stream diretamente
    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });

  } catch (error) {
    console.error('Erro ao chamar OpenAI:', error);
    return new Response(JSON.stringify({ error: 'Erro interno ao processar sua solicitação' }), { status: 500 });
  }
}