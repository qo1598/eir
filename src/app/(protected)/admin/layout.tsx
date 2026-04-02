"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Lock, ShieldCheck } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isChecking, setIsChecking] = useState(true)

  const ADMIN_PASSWORD = "1932asdaa!"

  useEffect(() => {
    // Check session storage for existing auth
    const authStatus = sessionStorage.getItem("admin_auth")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
    setIsChecking(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem("admin_auth", "true")
      setError("")
    } else {
      setError("비밀번호가 올바르지 않습니다.")
    }
  }

  if (isChecking) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
        <div className="h-4 w-32 bg-slate-200 rounded"></div>
      </div>
    </div>
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-2">
          <CardHeader className="space-y-1 text-center">
            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">운영자 인증</CardTitle>
            <CardDescription>
              운영자 페이지에 접속하려면 비밀번호를 입력하세요.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="비밀번호 입력"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  className={error ? "border-red-500" : ""}
                />
                {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full font-bold h-11 text-lg">
                접속하기
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="font-bold text-slate-900">운영자 모드</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => {
              sessionStorage.removeItem("admin_auth")
              setIsAuthenticated(false)
            }}>
              로그아웃
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="/">사이트로 돌아가기</a>
            </Button>
          </div>
        </div>
      </header>
      <main>
        {children}
      </main>
    </div>
  )
}
