import { ManualNoticeForm } from "@/components/admin/ManualNoticeForm"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function NewNoticePage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/admin">
            <ChevronLeft className="w-4 h-4 mr-2" />
            대시보드로 돌아가기
          </Link>
        </Button>
      </div>

      <div className="space-y-4 mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          공문 직접 등록
        </h1>
        <p className="text-slate-500 text-lg">
          공식 전자문서 외에 추가적인 안내나 직접 작성한 정보를 등록합니다.
        </p>
      </div>

      <ManualNoticeForm />
    </div>
  )
}
