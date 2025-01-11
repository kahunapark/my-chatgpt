import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

type ErrorWithMessage = {
  message?: string;
  status?: number;
  code?: string;
};

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key is missing');
    return NextResponse.json(
      { error: 'OpenAI API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const { messages } = body;
    
    if (!messages || !Array.isArray(messages)) {
      console.error('Invalid messages format:', messages);
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    console.log('Processing messages:', JSON.stringify(messages, null, 2));

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        ...messages.map(msg => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content
        })),
      ],
    });

    const reply = completion.choices[0]?.message;

    if (!reply) {
      console.error('No response from OpenAI');
      throw new Error('No response from OpenAI');
    }

    console.log('OpenAI response:', JSON.stringify(reply, null, 2));

    return NextResponse.json({
      role: 'assistant',
      content: reply.content
    });
  } catch (error: unknown) {
    const err = error as ErrorWithMessage;
    console.error('Detailed error:', {
      message: err.message,
      status: err.status,
      code: err.code,
      stack: (error as Error).stack,
    });
    
    // API 키 관련 에러 처리
    if (err?.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid API key configuration' },
        { status: 500 }
      );
    }

    // Rate limit 에러 처리
    if (err?.message?.includes('rate limit')) {
      return NextResponse.json(
        { error: '요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.' },
        { status: 429 }
      );
    }

    // 모델 관련 에러 처리
    if (err?.message?.includes('model')) {
      return NextResponse.json(
        { error: '현재 모델을 사용할 수 없습니다. 잠시 후 다시 시도해 주세요.' },
        { status: 503 }
      );
    }

    // 일반적인 에러 응답
    return NextResponse.json(
      { 
        error: '죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      },
      { status: 500 }
    );
  }
} 