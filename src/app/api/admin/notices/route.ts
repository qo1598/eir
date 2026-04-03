import { prisma } from "@/lib/db/prisma"
import { NextResponse } from "next/server"

export async function DELETE(req: Request) {
  try {
    const { ids } = await req.json()
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "삭제할 아이디가 없습니다." }, { status: 400 })
    }

    await prisma.notice.deleteMany({
      where: {
        id: { in: ids }
      }
    })

    return NextResponse.json({ success: true, count: ids.length })
  } catch (error) {
    console.error("Batch Delete Error:", error)
    return NextResponse.json({ error: "삭제 중 오류가 발생했습니다." }, { status: 500 })
  }
}
