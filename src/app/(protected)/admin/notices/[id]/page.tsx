// src/app/admin/notices/[id]/page.tsx

import { prisma } from "@/lib/db/prisma"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, Mail, Calendar, Building, User, Users } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

async function getAdminNoticeDetail(id: string) {
  const notice = await prisma.notice.findUnique({
    where: { id },
    include: {
      tags: true,
      interests: {
        orderBy: { createdAt: "desc" }
      }
    }
  })
  
  return notice
}

export default async function AdminNoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const notice = await getAdminNoticeDetail(id)

  if (!notice) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/admin">
          <ChevronLeft className="w-4 h-4 mr-2" />
          관리자 대시보드로 돌아가기
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Notice Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">공문 정보</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">제목</p>
                <p className="font-semibold text-slate-900 leading-snug">{notice.title}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">카테고리</p>
                  <Badge variant="outline">{notice.categoryMain}</Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">상태</p>
                  <Badge className={notice.visibilityStatus === 'public' ? 'bg-green-100 text-green-700' : 'bg-slate-100'}>
                    {notice.visibilityStatus === 'public' ? '공개 중' : '비공개'}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">발신처</p>
                <p className="text-sm">{notice.senderName || "-"}</p>
              </div>
              <div className="flex justify-between border-t pt-4">
                 <Button variant="outline" size="sm" className="w-full mr-2">편집</Button>
                 <Button variant="outline" size="sm" className="w-full text-red-500 hover:text-red-600">본문 보기</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Interest List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                관심 교사 명단 ({notice.interests.length}명)
              </h2>
              <Button size="sm" variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                명단 다운로드
              </Button>
            </div>
            {notice.interests.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>교사 정보</TableHead>
                    <TableHead>관심 유형</TableHead>
                    <TableHead>신청일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notice.interests.map((interest: any) => (
                    <TableRow key={interest.id} className="group">
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-bold flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {interest.name}
                          </p>
                          <p className="text-xs text-slate-500 flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 text-slate-400" />
                            {interest.affiliation}
                          </p>
                        </div>
                        {interest.memo && (
                          <div className="mt-2 p-2 bg-slate-50 rounded text-xs text-slate-600 italic">
                            &quot;{interest.memo}&quot;
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-medium">{interest.interestType}</Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {format(interest.createdAt, "MM-dd HH:mm")}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-20 text-slate-400">
                 아직 관심을 보인 교사가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
