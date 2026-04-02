"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Hash, Calendar, FileText, Building, CheckCircle2 } from "lucide-react"

export function ManualNoticeForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    senderName: "",
    documentNumber: "",
    registeredAt: new Date().toISOString().split("T")[0],
    deadlineAt: "",
    categoryMain: "디지털",
    summary: "",
    tagsInput: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const tags = formData.tagsInput
        .split(/[\s,]+/)
        .filter(t => t.trim() !== "")
        .map(t => t.startsWith("#") ? t.substring(1) : t)

      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags
        }),
      })

      if (res.ok) {
        router.push("/admin")
        router.refresh()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          공문 직접 등록
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-bold">제목</Label>
            <Input 
              id="title" 
              placeholder="공문 제목을 입력하세요" 
              required 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="senderName">발신처 / 작성자</Label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input 
                  id="senderName" 
                  className="pl-9"
                  placeholder="예: 서울OO초등학교, 운영자 등" 
                  value={formData.senderName}
                  onChange={e => setFormData({...formData, senderName: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="documentNumber">공문번호</Label>
              <div className="relative">
                <Hash className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input 
                  id="documentNumber" 
                  className="pl-9"
                  placeholder="예: 융합인재과-1234" 
                  value={formData.documentNumber}
                  onChange={e => setFormData({...formData, documentNumber: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registeredAt">등록일 (공문 시행일)</Label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input 
                  id="registeredAt" 
                  type="date"
                  className="pl-9"
                  required
                  value={formData.registeredAt}
                  onChange={e => setFormData({...formData, registeredAt: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadlineAt">마감일 (선택)</Label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input 
                  id="deadlineAt" 
                  type="date"
                  className="pl-9 text-red-600"
                  value={formData.deadlineAt}
                  onChange={e => setFormData({...formData, deadlineAt: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryMain">주요 카테고리</Label>
            <Select 
              value={formData.categoryMain}
              onValueChange={val => setFormData({...formData, categoryMain: val || "디지털"})}
            >
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="디지털">디지털</SelectItem>
                <SelectItem value="AI">AI</SelectItem>
                <SelectItem value="정보">정보</SelectItem>
                <SelectItem value="에듀테크">에듀테크</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">요약 및 상세 내용</Label>
            <Textarea 
              id="summary" 
              placeholder="내용을 요약하거나 상세 안내를 입력하세요" 
              className="min-h-[150px] resize-none"
              value={formData.summary}
              onChange={e => setFormData({...formData, summary: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tagsInput" className="flex items-center gap-1.5">
              해시태그 (공백 또는 쉼표로 구분)
            </Label>
            <div className="relative">
               <Hash className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
               <Input 
                id="tagsInput" 
                className="pl-9"
                placeholder="예: 연구회, 선도교사, SW교육" 
                value={formData.tagsInput}
                onChange={e => setFormData({...formData, tagsInput: e.target.value})}
              />
            </div>
            <p className="text-[0.7rem] text-slate-400">등록 후에도 관리자 페이지에서 수정이 가능합니다.</p>
          </div>
        </CardContent>
        <CardFooter className="pt-4 flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
            취소
          </Button>
          <Button type="submit" className="flex-1 font-bold" disabled={loading}>
            {loading ? "등록 중..." : "등록하기"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
