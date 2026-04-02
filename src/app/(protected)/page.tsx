import { prisma } from "@/lib/db/prisma"
import { NoticeList } from "@/components/notice/NoticeList"
import { FilterToolbar } from "@/components/notice/FilterToolbar"
import { Suspense } from "react"
import { Notice, NoticeTag } from "@prisma/client"

async function getNoticesSafe(searchParams: { q?: string; category?: string }) {
  const { q, category } = searchParams
  
  const where: any = {
    visibilityStatus: "public",
  }

  if (q || category) {
    where.AND = []
    if (q) {
      where.AND.push({
        OR: [
          { title: { contains: q } },
          { senderName: { contains: q } },
        ]
      })
    }
    if (category) {
      where.AND.push({ categoryMain: category })
    }
  }

  // Notice matching the include type
  const notices = await prisma.notice.findMany({
    where,
    include: {
      tags: true,
      _count: {
        select: { interests: true }
      }
    },
    orderBy: [
      { pinned: "desc" },
      { registeredAt: "desc" },
      { createdAt: "desc" },
    ]
  })

  return notices as (Notice & { tags: NoticeTag[]; _count: { interests: number } })[]
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const params = await searchParams
  const notices = await getNoticesSafe(params)

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900 sm:text-5xl">
          AI·디지털 공문 큐레이션
        </h1>
        <p className="text-base md:text-lg text-slate-500 max-w-4xl mx-auto whitespace-nowrap">
          교육청 및 학교 현장의 디지털 교육 관련 핵심 정보를 한눈에 확인하고 중요한 기회를 놓치지 마세요.
        </p>
      </div>

      <FilterToolbar />

      <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1,2,3,4,5,6].map(i => <div key={i} className="bg-slate-100 rounded-xl h-64" />)}
      </div>}>
        {notices.length > 0 ? (
          <NoticeList initialNotices={notices} />
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-400 font-medium">검색 결과가 없습니다.</p>
            <p className="text-sm text-slate-400 mt-1">다른 키워드로 검색해 보세요.</p>
          </div>
        )}
      </Suspense>
    </div>
  )
}
