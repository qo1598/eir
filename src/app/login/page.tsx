"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { RESEARCH_GROUP_MEMBERS } from "@/lib/constants/participants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShieldCheck, User, ArrowRight, Sparkles } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const trimmedName = name.trim()
    
    if (!trimmedName) {
      setError("성함을 입력해 주세요.")
      setLoading(false)
      return
    }

    const isMember = RESEARCH_GROUP_MEMBERS.includes(trimmedName)

    if (isMember) {
      const expires = new Date()
      expires.setDate(expires.getDate() + 1)
      document.cookie = `research_user_name=${encodeURIComponent(trimmedName)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`
      
      router.push(callbackUrl)
      router.refresh()
    } else {
      setError("등록된 연구회 명단에서 찾을 수 없습니다.")
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-mesh animate-mesh">
      {/* Decorative Blur Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-[400px] relative z-10">
        {/* Branding Header */}
        <div className="text-center mb-10">
           <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">
             AI·디지털 공문 큐레이션
           </h1>
        </div>

        {/* Login Card */}
        <div className="glass rounded-[24px] p-8 border-white/50 relative overflow-hidden">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <Input 
                  id="name"
                  placeholder="성함을 입력하세요" 
                  className={`pl-12 h-14 bg-white/50 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all rounded-2xl text-lg ${error ? 'border-red-400 bg-red-50/50' : ''}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  disabled={loading}
                />
              </div>
              {error && (
                <div className="flex items-center gap-1.5 text-red-500 text-sm font-bold mt-2 ml-1">
                  {error}
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center" 
              disabled={loading}
            >
              {loading ? "확인 중..." : "인증하고 입장하기"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
