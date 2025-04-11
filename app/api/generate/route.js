import { generateStreamingCompletion } from '@/lib/handlers/openaiHandlers';

export async function POST(req) {
  try {
    const { messages } = await req.json();
    if (!messages || messages.length === 0)
      return new Response(JSON.stringify({ error: 'Nenhuma mensagem fornecida' }), { status: 400 });

    const stream = await generateStreamingCompletion(
      messages.map((m) => ({ role: m.role, content: m.content }))
    );

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Erro interno ao processar sua solicitação' }), { status: 500 });
  }
}