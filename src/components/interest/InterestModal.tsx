// src/components/interest/InterestModal.tsx

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShieldCheck, Info } from "lucide-react"

interface InterestModalProps {
  isOpen: boolean
  onClose: () => void
  noticeId: string
  noticeTitle: string
}

export function InterestModal({ isOpen, onClose, noticeId, noticeTitle }: InterestModalProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    affiliation: "",
    memo: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch("/api/interests", {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, noticeId }),
      })
      
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          onClose()
        }, 2000)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        {success ? (
          <div className="py-12 text-center space-y-4">
            <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold">관심 등록 완료!</h2>
            <p className="text-slate-500 text-sm">운영자가 확인 후 안내해 드립니다.</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold tracking-tight">관심 남기기</DialogTitle>
              <DialogDescription className="text-sm font-medium text-slate-900 mt-2">
                &quot;{noticeTitle}&quot;
              </DialogDescription>
            </DialogHeader>
            
            <Alert className="bg-blue-50 border-blue-100 text-blue-800 py-3 mt-4">
              <Info className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-[0.8rem] leading-relaxed">
                회원님의 상세 정보(성함, 소속)는 **운영자만** 확인할 수 있습니다. 
                다른 사용자에게는 전체 관심자 수치만 공개됩니다.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="affiliation">소속 (학교명)</Label>
                <Input 
                  id="affiliation" 
                  placeholder="예: 대구OO초등학교" 
                  required 
                  value={formData.affiliation}
                  onChange={e => setFormData({...formData, affiliation: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">성함</Label>
                <Input 
                  id="name" 
                  placeholder="성함을 입력하세요" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="memo">기타 메모 (선택)</Label>
                <Textarea 
                  id="memo" 
                  placeholder="추가로 궁금한 점이 있다면 적어주세요." 
                  className="resize-none h-20"
                  value={formData.memo}
                  onChange={e => setFormData({...formData, memo: e.target.value})}
                />
              </div>
              
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full font-bold" disabled={loading}>
                  {loading ? "등록 중..." : "관심 표현하기"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
