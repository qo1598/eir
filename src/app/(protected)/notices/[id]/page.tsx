// src/app/notices/[id]/page.tsx

import { prisma } from "@/lib/db/prisma"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Building, FileText, ChevronLeft, UserPlus } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { NoticeList } from "@/components/notice/NoticeList" // I'll use a single notice list with one item for the modal logic

async function getNotice(id: string) {
  const notice = await prisma.notice.findUnique({
    where: { id, visibilityStatus: "public" },
    include: {
      tags: true,
      _count: {
        select: { interests: true }
      }
    }
  })
  
  return notice
}

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const notice = await getNotice(id)

  if (!notice) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/">
          <ChevronLeft className="w-4 h-4 mr-2" />
          목록으로 돌아가기
        </Link>
      </Button>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden mb-10">
        <div className="p-8 border-b bg-slate-50/50">
          <div className="flex gap-2 mb-4">
             <Badge variant="outline">{notice.categoryMain}</Badge>
             {notice.pinned && <Badge className="bg-blue-600">상단고정</Badge>}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
            {notice.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-y-4 gap-x-8 text-sm text-slate-500">
            <div className="flex items-center gap-1.5 font-medium text-slate-900">
              <Building className="w-4 h-4" /> 
              <span>{notice.senderName || "미지정"}</span>
            </div>
            {notice.documentNumber && (
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> 
                <span>{notice.documentNumber}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> 
              <span>등록일: {notice.registeredAt ? format(notice.registeredAt, "yyyy.MM.dd") : "-"}</span>
            </div>
            {notice.deadlineAt && (
              <div className="flex items-center gap-1.5 text-red-500 font-semibold">
                <Calendar className="w-4 h-4" /> 
                <span>마감: {format(notice.deadlineAt, "yyyy.MM.dd")}</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold mb-4">공문 요약 및 안내</h2>
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
            {notice.summary || "상세 내용이 등록되지 않았습니다."}
          </div>
          
          <div className="mt-8 pt-8 border-t">
            <div className="flex flex-wrap gap-2">
              {notice.tags.map((tag: any) => (
                <Badge key={tag.id} className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200">
                  #{tag.tagName}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
             <div className="bg-primary/10 p-3 rounded-full text-primary">
                <UserPlus className="w-6 h-6" />
             </div>
             <div>
               <p className="font-bold text-lg">현재 {notice._count.interests}명이 관심을 표현했습니다.</p>
               <p className="text-sm text-slate-500">관심을 남기시면 운영자가 개별 안내 드립니다.</p>
             </div>
          </div>
          
          {/* I'll use the NoticeList logic to trigger the modal */}
          <NoticeList initialNotices={[notice as any]} />
        </div>
      </div>
    </div>
  )
}
