// src/app/(protected)/admin/uploads/page.tsx

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, ChevronRight, Check, ListChecks } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

interface ParsedNotice {
  tempId: string;
  title: string;
  senderName?: string;
  documentNumber?: string;
  categoryMain: string;
  importanceLevel: string;
  registeredAt?: string;
  tags: { tagType: string; tagName: string }[];
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [parsedData, setParsedData] = useState<ParsedNotice[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [result, setResult] = useState<{ success: boolean; count?: number; error?: string } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResult(null)
    }
  }

  const handleParse = async () => {
    if (!file) return
    
    setLoading(true)
    setResult(null)
    
    const formData = new FormData()
    formData.append("file", file)
    formData.append("action", "parse")
    
    try {
      const res = await fetch("/api/admin/upload/csv", {
        method: "POST",
        body: formData,
      })
      
      const data = await res.json()
      
      if (res.ok) {
        if (data.data.length === 0) {
          setResult({ success: false, error: "조건(디지털/AI)에 맞는 공문이 없습니다." })
        } else {
          setParsedData(data.data)
          setSelectedIds(new Set(data.data.map((item: ParsedNotice) => item.tempId)))
          setStep(2)
        }
      } else {
        setResult({ success: false, error: data.error || "파싱 중 오류가 발생했습니다." })
      }
    } catch (err) {
      setResult({ success: false, error: "서버와의 통신에 실패했습니다." })
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    if (selectedIds.size === 0) return
    
    setLoading(true)
    
    const selectedData = parsedData.filter(item => selectedIds.has(item.tempId))
    
    const formData = new FormData()
    formData.append("action", "upload")
    formData.append("data", JSON.stringify(selectedData))
    
    try {
      const res = await fetch("/api/admin/upload/csv", {
        method: "POST",
        body: formData,
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setResult({ success: true, count: data.count })
        setStep(1)
        setFile(null)
        setParsedData([])
      } else {
        setResult({ success: false, error: data.error || "등록 중 오류가 발생했습니다." })
      }
    } catch (err) {
      setResult({ success: false, error: "서버와의 통신에 실패했습니다." })
    } finally {
      setLoading(false)
    }
  }

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(parsedData.map(item => item.tempId)))
    } else {
      setSelectedIds(new Set())
    }
  }

  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/admin">← 대시보드로 돌아가기</Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">CSV 공문 업로드</h1>
            <p className="text-slate-500">배포된 CSV 파일을 업로드하여 공문을 대량으로 등록합니다.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <div className={`flex items-center gap-1 ${step === 1 ? 'text-blue-600' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step === 1 ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}>1</span>
              파일 선택
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <div className={`flex items-center gap-1 ${step === 2 ? 'text-blue-600' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${step === 2 ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}>2</span>
              데이터 확인
            </div>
          </div>
        </div>
      </div>

      {step === 1 ? (
        <Card className="border-2 border-dashed bg-slate-50/50">
          <CardHeader>
            <CardTitle>파일 선택</CardTitle>
            <CardDescription>
              표준 공문 목록 CSV 파일을 선택해 주세요. 제목에 "디지털" 또는 "AI"가 포함된 공문만 필터링됩니다.
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
              <p className="text-xs text-slate-400 mt-2">CSV 형식만 지원합니다. (UTF-8, EUC-KR)</p>
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
                    ? `${result.count}건의 공문이 성공적으로 등록되었습니다.` 
                    : result.error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 bg-slate-100/50 pt-6">
            <Button variant="outline" asChild>
              <Link href="/admin">취소</Link>
            </Button>
            <Button onClick={handleParse} disabled={!file || loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  파일 분석 중...
                </>
              ) : (
                "파일 분석 및 필터링 시작"
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-slate-50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">필터링 결과 확인</CardTitle>
                <CardDescription>
                  총 {parsedData.length}건 중 {selectedIds.size}건 선택됨
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                  뒤로가기
                </Button>
                <Button size="sm" onClick={handleUpload} disabled={selectedIds.size === 0 || loading}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  {selectedIds.size}건 최종 등록
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-sm text-left">
                <thead className="sticky top-0 bg-slate-100 text-slate-700 border-b">
                  <tr>
                      <th className="p-4 w-10">
                        <input 
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 accent-blue-600 cursor-pointer"
                          checked={selectedIds.size === parsedData.length && parsedData.length > 0} 
                          onChange={(e) => toggleSelectAll(e.target.checked)} 
                        />
                      </th>
                    <th className="p-4 font-semibold">제목</th>
                    <th className="p-4 font-semibold">발신처</th>
                    <th className="p-4 font-semibold">등록일</th>
                    <th className="p-4 font-semibold">카테고리</th>
                    <th className="p-4 font-semibold">중요도</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {parsedData.map((item) => (
                    <tr key={item.tempId} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <input 
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 accent-blue-600 cursor-pointer"
                          checked={selectedIds.has(item.tempId)} 
                          onChange={() => toggleSelectItem(item.tempId)} 
                        />
                      </td>
                      <td className="p-4 font-medium">{item.title}</td>
                      <td className="p-4 text-slate-500">{item.senderName || "-"}</td>
                      <td className="p-4 text-slate-500">
                        {item.registeredAt ? format(new Date(item.registeredAt), 'yyyy-MM-dd') : "-"}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {item.categoryMain}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.importanceLevel === 'high' ? 'bg-red-100 text-red-700' :
                          item.importanceLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {item.importanceLevel === 'high' ? '높음' :
                           item.importanceLevel === 'medium' ? '중간' : '낮음'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <ListChecks className="w-5 h-5" />
          공문 업로드 가이드
        </h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc pl-5">
          <li className="font-semibold">제목에 "디지털" 또는 "AI"가 포함된 공문만 자동으로 추출됩니다.</li>
          <li>추출된 리스트를 확인하고 실제로 등록할 항목만 선택해 주세요.</li>
          <li>최종 등록 시 모든 공문은 자동으로 "공개" 상태로 등록됩니다.</li>
          <li>날짜 형식이 올바르지 않으면 공문 등록 시 누락될 수 있습니다.</li>
        </ul>
      </div>
    </div>
  )
}
