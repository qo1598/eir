import { prisma } from "@/lib/db/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { title, summary, senderName, documentNumber, registeredAt, deadlineAt, categoryMain, tags } = data

    const notice = await prisma.notice.create({
      data: {
        title,
        summary,
        senderName: senderName || "운영자",
        documentNumber,
        registeredAt: registeredAt ? new Date(registeredAt) : new Date(),
        deadlineAt: deadlineAt ? new Date(deadlineAt) : null,
        categoryMain: categoryMain || "디지털",
        sourceType: "manual",
        importanceLevel: "medium", // Default
        visibilityStatus: "public",
        tags: {
          create: tags.map((tag: string) => ({
            tagName: tag.replace("#", ""),
            tagType: "custom",
            tagSource: "manual"
          }))
        }
      }
    })

    return NextResponse.json(notice)
  } catch (error) {
    console.error("Manual registration error:", error)
    return NextResponse.json({ error: "Failed to register notice" }, { status: 500 })
  }
}
