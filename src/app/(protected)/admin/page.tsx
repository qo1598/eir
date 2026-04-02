// src/app/admin/page.tsx

import { prisma } from "@/lib/db/prisma"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table" // Need to add table
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Users, FileText, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

async function getAdminData() {
  const notices = await prisma.notice.findMany({
    include: {
      _count: {
        select: { interests: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })
  
  const totalInterests = await prisma.interest.count()
  
  return { notices, totalInterests }
}

export default async function AdminDashboard() {
  const { notices, totalInterests } = await getAdminData()

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">관리자 대시보드</h1>
          <p className="text-slate-500 mt-1">공문 관리 및 교사 관심 현황을 모니터링합니다.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/uploads">
              <Upload className="w-4 h-4 mr-2" />
              CSV 업로드
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/notices/new">
              <Plus className="w-4 h-4 mr-2" />
              공문 직접 등록
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">전체 공문</p>
              <p className="text-2xl font-bold">{notices.length}건</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">전체 관심 교사</p>
              <p className="text-2xl font-bold">{totalInterests}명</p>
            </div>
          </div>
        </div>
         <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">검토 필요</p>
              <p className="text-2xl font-bold">{notices.filter((n: any) => n.visibilityStatus === 'draft').length}건</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold">최근 등록 공문 리스트</h2>
        </div>
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[400px]">공문 제목</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>등록일</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">관심 교사</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notices.map((notice: any) => (
              <TableRow key={notice.id} className="hover:bg-slate-50/50">
                <TableCell className="font-medium">
                  {notice.title}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{notice.categoryMain}</Badge>
                </TableCell>
                <TableCell className="text-slate-500 text-sm">
                  {notice.registeredAt ? format(notice.registeredAt, "yyyy-MM-dd") : "-"}
                </TableCell>
                <TableCell>
                  <Badge 
                    className={notice.visibilityStatus === 'public' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-slate-100 text-slate-700 hover:bg-slate-100'}
                  >
                    {notice.visibilityStatus === 'public' ? '공개' : '대기'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-bold text-primary">
                  {notice._count?.interests || 0}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/notices/${notice.id}`}>편집</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {notices.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-400">
                  등록된 공문이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
