import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        ...messages,
      ],
    });

    return NextResponse.json(completion.choices[0].message);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: '죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.' },
      { status: 500 }
    );
  }
} 