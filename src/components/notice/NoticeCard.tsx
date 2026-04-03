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
      {/* 상단 고정 뱃지 */}
      {notice.pinned && (
        <Badge className="absolute top-3 left-3 z-10 bg-blue-600 text-[10px] text-white hover:bg-blue-700 px-1.5 py-0 h-5">
          상단고정
        </Badge>
      )}

      <CardHeader className="p-4 pb-1.5 pt-10">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-base font-bold leading-[1.3] line-clamp-2 flex-grow">
            {notice.title}
          </CardTitle>
          
          {/* 관심 교사 숫자 - 제목 옆으로 이동 */}
          <div className="flex items-center gap-1 text-primary font-bold text-xs bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10 shrink-0 mt-0.5">
            <UserPlus className="w-3 h-3" />
            <span>{notice._count?.interests || 0}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 overflow-hidden flex-grow pb-4">
        <div className="flex flex-col gap-1.5 text-[13px] text-slate-500">
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <Building className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{notice.senderName || "미지정"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 shrink-0 text-slate-400" />
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
