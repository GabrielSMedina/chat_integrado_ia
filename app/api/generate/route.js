import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Certifique-se de que essa variável está definida no .env
});

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4', // ou "gpt-3.5-turbo" se quiser algo mais leve
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const content = response.choices[0].message.content;

    return Response.json({ response: content });
  } catch (error) {
    console.error('Erro ao chamar OpenAI:', error);
    return new Response('Erro interno', { status: 500 });
  }
}
