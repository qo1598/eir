import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Building, Eye, UserPlus } from "lucide-react";
import type { Notice, NoticeTag } from "@prisma/client";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

interface NoticeCardProps {
  notice: Notice & { tags: NoticeTag[]; _count?: { interests: number } };
  onInterestClick?: (noticeId: string) => void;
}

export function NoticeCard({ notice, onInterestClick }: NoticeCardProps) {
  const isOfficial = notice.sourceType === "official";
  const importanceColor = notice.importanceLevel === "high" ? "bg-red-100 text-red-700 border-red-200" :
                         notice.importanceLevel === "medium" ? "bg-amber-100 text-amber-700 border-amber-200" :
                         "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full border-slate-200">
      {/* 상단 고정 뱃지 - absolute로 배치하여 다른 요소의 위치에 영향을 주지 않음 */}
      {notice.pinned && (
        <Badge className="absolute top-4 left-4 z-10 bg-blue-600 text-[10px] text-white hover:bg-blue-700 px-1.5 py-0 h-5">
          상단고정
        </Badge>
      )}

      {/* 관심 교사 숫자 - 우측 상단 배치 */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 text-primary font-bold text-xs bg-primary/5 px-2 py-1 rounded-full border border-primary/10">
        <UserPlus className="w-3 h-3" />
        <span>{notice._count?.interests || 0}</span>
      </div>

      <CardHeader className="p-5 pb-2 pt-12"> {/* pt-12를 주어 뱃지 공간 확보 및 제목 라인 통일 */}
        <CardTitle className="text-lg font-bold leading-tight line-clamp-2 pr-10">
          {notice.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-5 pt-0 overflow-hidden flex-grow px-5 pb-5">
        <div className="flex flex-col gap-2.5 text-sm text-slate-500">
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <Building className="w-4 h-4 shrink-0 text-slate-400" />
            <span className="truncate">{notice.senderName || "미지정"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>{notice.registeredAt ? format(new Date(notice.registeredAt), "yyyy-MM-dd") : "미지정"}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 bg-slate-50 flex items-center justify-center border-t border-slate-200 min-h-[72px]">
        <Button 
           className="w-full font-bold shadow-sm h-11" 
           onClick={() => onInterestClick?.(notice.id)}
        >
          관심 표현하기
        </Button>
      </CardFooter>
    </Card>
  );
}
