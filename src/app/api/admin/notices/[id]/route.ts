import { prisma } from "@/lib/db/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { visibilityStatus } = await req.json()
    
    if (!visibilityStatus) {
      return NextResponse.json({ error: "변경할 상태가 없습니다." }, { status: 400 })
    }

    const updatedNotice = await prisma.notice.update({
      where: { id },
      data: { visibilityStatus }
    })

    return NextResponse.json({ success: true, data: updatedNotice })
  } catch (error) {
    console.error("Notice Update Error:", error)
    return NextResponse.json({ error: "공문 수정 중 오류가 발생했습니다." }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.notice.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Notice Delete Error:", error)
    return NextResponse.json({ error: "공문 삭제 중 오류가 발생했습니다." }, { status: 500 })
  }
}
