import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
      ],
    });

    const reply = completion.choices[0]?.message;

    if (!reply) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json({
      role: 'assistant',
      content: reply.content
    });
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    // API 키 관련 에러 처리
    if (error?.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid API key configuration' },
        { status: 500 }
      );
    }

    // 일반적인 에러 응답
    return NextResponse.json(
      { error: '죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.' },
      { status: 500 }
    );
  }
} 