// src/app/admin/uploads/page.tsx

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; count?: number; error?: string } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    
    setLoading(true)
    setResult(null)
    
    const formData = new FormData()
    formData.append("file", file)
    
    try {
      const res = await fetch("/api/admin/upload/csv", {
        method: "POST",
        body: formData,
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setResult({ success: true, count: data.count })
      } else {
        setResult({ success: false, error: data.error || "업로드 중 오류가 발생했습니다." })
      }
    } catch (err) {
      setResult({ success: false, error: "서버와의 통신에 실패했습니다." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/admin">← 대시보드로 돌아가기</Link>
        </Button>
        <h1 className="text-3xl font-bold">CSV 공문 업로드</h1>
        <p className="text-slate-500">배포된 CSV 파일을 업로드하여 공문을 대량으로 등록합니다.</p>
      </div>

      <Card className="border-2 border-dashed bg-slate-50/50">
        <CardHeader>
          <CardTitle>파일 선택</CardTitle>
          <CardDescription>
            표준 공문 목록 CSV 파일을 선택해 주세요. (제목, 발신처, 등록일 포함)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-300 rounded-xl bg-white">
            <Upload className="w-12 h-12 text-slate-300 mb-4" />
            <Input 
              type="file" 
              accept=".csv" 
              className="max-w-xs cursor-pointer" 
              onChange={handleFileChange}
            />
            <p className="text-xs text-slate-400 mt-2">CSV 형식만 지원합니다.</p>
          </div>
          
          {file && (
            <div className="flex items-center gap-3 p-3 bg-white border rounded-lg">
              <FileText className="w-5 h-5 text-blue-500" />
              <div className="flex-grow">
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setFile(null)}>취소</Button>
            </div>
          )}

          {result && (
            <Alert variant={result.success ? "default" : "destructive"} className={result.success ? "bg-green-50 border-green-200" : ""}>
              {result.success ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>{result.success ? "성공" : "실패"}</AlertTitle>
              <AlertDescription>
                {result.success 
                  ? `${result.count}건의 공문이 성공적으로 분류 및 등록되었습니다.` 
                  : result.error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2 bg-slate-100/50 pt-6">
          <Button variant="outline" asChild>
            <Link href="/admin">취소</Link>
          </Button>
          <Button onClick={handleUpload} disabled={!file || loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                처리 중...
              </>
            ) : (
              "업로드 및 분류 시작"
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
        <h3 className="font-bold text-blue-900 mb-2">업로드 가이드</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc pl-5">
          <li>CSV 파일의 첫 줄은 헤더여야 합니다.</li>
          <li>필수 필드: 제목, 발신처(또는 생산처), 등록일(또는 날짜).</li>
          <li>AI/디지털 교육 관련 키워드가 포함된 공문만 자동으로 공개 상태로 등록됩니다.</li>
          <li>나머지는 비공개(draft) 상태로 등록되어 검토가 가능합니다.</li>
        </ul>
      </div>
    </div>
  )
}
