"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import Link from "next/link"
import { Trash2, Eye, EyeOff, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface AdminNoticeTableProps {
  initialNotices: any[]
}

export function AdminNoticeTable({ initialNotices }: AdminNoticeTableProps) {
  const [notices, setNotices] = useState(initialNotices)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const router = useRouter()

  const toggleSelectAll = () => {
    if (selectedIds.length === notices.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(notices.map(n => n.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`${selectedIds.length}개의 공문을 삭제하시겠습니까?`)) return

    setIsDeleting(true)
    try {
      const res = await fetch("/api/admin/notices", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds })
      })

      if (res.ok) {
        setNotices(prev => prev.filter(n => !selectedIds.includes(n.id)))
        setSelectedIds([])
        router.refresh()
      }
    } catch (error) {
      console.error("Delete failed:", error)
      alert("삭제 중 오류가 발생했습니다.")
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleVisibility = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "public" ? "hidden" : "public"
    setLoadingId(id)

    try {
      const res = await fetch(`/api/admin/notices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibilityStatus: newStatus })
      })

      if (res.ok) {
        setNotices(prev => prev.map(n => 
          n.id === id ? { ...n, visibilityStatus: newStatus } : n
        ))
        router.refresh()
      }
    } catch (error) {
      console.error("Toggle visibility failed:", error)
      alert("상태 변경 중 오류가 발생했습니다.")
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold">공문 리스트 ({notices.length}건)</h2>
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
              <span className="text-sm text-slate-500 font-medium">{selectedIds.length}개 선택됨</span>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteSelected}
                disabled={isDeleting}
                className="h-8 px-3"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Trash2 className="w-3.5 h-3.5 mr-1" />}
                삭제
              </Button>
            </div>
          )}
        </div>
      </div>
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[50px] p-4 text-center">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-slate-300 accent-primary"
                checked={selectedIds.length === notices.length && notices.length > 0}
                onChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[400px]">공문 제목</TableHead>
            <TableHead>카테고리</TableHead>
            <TableHead>등록일</TableHead>
            <TableHead>상태</TableHead>
            <TableHead className="text-right">관심 교사</TableHead>
            <TableHead className="text-right">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notices.map((notice) => (
            <TableRow key={notice.id} className={`hover:bg-slate-50/50 transition-colors ${selectedIds.includes(notice.id) ? 'bg-slate-50' : ''}`}>
              <TableCell className="p-4 text-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-300 accent-primary"
                  checked={selectedIds.includes(notice.id)}
                  onChange={() => toggleSelect(notice.id)}
                />
              </TableCell>
              <TableCell className="font-medium whitespace-normal leading-snug">
                {notice.title}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{notice.categoryMain}</Badge>
              </TableCell>
              <TableCell className="text-slate-500 text-sm">
                {notice.registeredAt ? format(new Date(notice.registeredAt), "yyyy-MM-dd") : "-"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge 
                    className={notice.visibilityStatus === 'public' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-slate-100 text-slate-700 hover:bg-slate-100'}
                  >
                    {notice.visibilityStatus === 'public' ? '공개' : '비공개'}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-right font-bold text-primary">
                {notice._count?.interests || 0}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => toggleVisibility(notice.id, notice.visibilityStatus)}
                    disabled={loadingId === notice.id}
                    title={notice.visibilityStatus === 'public' ? '비공개로 전환' : '공개로 전환'}
                  >
                    {loadingId === notice.id ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> : 
                     notice.visibilityStatus === 'public' ? <Eye className="w-4 h-4 text-slate-400" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="h-8">
                    <Link href={`/admin/notices/${notice.id}`}>편집</Link>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {notices.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-20 text-slate-400">
                등록된 공문이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
