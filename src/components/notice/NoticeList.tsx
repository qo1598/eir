// src/components/notice/NoticeList.tsx

"use client"

import { useState } from "react"
import { NoticeCard } from "./NoticeCard"
import { InterestModal } from "@/components/interest/InterestModal"
import type { Notice, NoticeTag } from "@prisma/client"

interface NoticeListProps {
  initialNotices: (Notice & { tags: NoticeTag[]; _count: { interests: number } })[]
}

export function NoticeList({ initialNotices }: NoticeListProps) {
  const [selectedNotice, setSelectedNotice] = useState<{ id: string; title: string } | null>(null)

  const handleInterestClick = (id: string) => {
    const notice = initialNotices.find(n => n.id === id)
    if (notice) {
      setSelectedNotice({ id: notice.id, title: notice.title })
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialNotices.map((notice) => (
          <NoticeCard 
            key={notice.id} 
            notice={notice} 
            onInterestClick={handleInterestClick}
          />
        ))}
      </div>

      {selectedNotice && (
        <InterestModal 
          isOpen={!!selectedNotice}
          onClose={() => setSelectedNotice(null)}
          noticeId={selectedNotice.id}
          noticeTitle={selectedNotice.title}
        />
      )}
    </>
  )
}
