import { OpenAI } from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateStreamingCompletion(messages) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    stream: true,
  });

  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        controller.enqueue(encoder.encode(content));
      }
      controller.close();
    },
  });
}