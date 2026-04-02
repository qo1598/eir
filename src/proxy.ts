import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 인증이 필요 없는 경로들
const PUBLIC_PATHS = [
  '/login',
  '/api/auth/login', // 로그인 처리 API (필요시)
  '/_next',
  '/static',
  '/favicon.ico',
  '/images',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 공개 경로는 검사 제외
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // 연구회 회원 인증 쿠키 확인
  const authCookie = request.cookies.get('research_user_name')

  if (!authCookie) {
    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    const loginUrl = new URL('/login', request.url)
    // 로그인 후 돌아올 원래 페이지 저장
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // matcher를 통해 모든 경로를 가로채되, 위 로직에서 필터링함
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}
