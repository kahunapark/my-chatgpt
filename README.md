# My ChatGPT Clone

ChatGPT 클론 프로젝트입니다. Next.js와 OpenAI API를 사용하여 구현되었습니다.

## 기능

- ChatGPT와 유사한 채팅 인터페이스
- OpenAI GPT-4 모델 사용
- 실시간 채팅 응답
- 모바일 반응형 디자인

## 기술 스택

- Next.js 14
- TypeScript
- Tailwind CSS
- OpenAI API

## 환경 변수 설정

프로젝트 실행을 위해 다음 환경 변수가 필요합니다:

```env
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

## 개발 환경 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 배포

이 프로젝트는 Vercel에 배포되어 있습니다. 배포 시 환경 변수를 Vercel 프로젝트 설정에서 추가해야 합니다.