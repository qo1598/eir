// src/app/api/admin/upload/csv/route.ts

import { prisma } from "@/lib/db/prisma"
import { NextResponse } from "next/server"
import Papa from "papaparse"
import { normalizeRow } from "@/lib/csv/normalizeRow"
import { classifyNotice } from "@/lib/tagging/classifyNotice"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 })
    }

    const text = await file.text()
    
    // Parse CSV
    const results = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    })

    if (results.errors.length > 0) {
      console.error("CSV Parse Errors:", results.errors)
      return NextResponse.json({ error: "CSV 파싱 중 오류가 발생했습니다." }, { status: 400 })
    }

    const rows = results.data as any[]
    let count = 0

    // Process each row
    for (const row of rows) {
      const normalized = normalizeRow(row)
      if (!normalized.title) continue

      const classification = classifyNotice(normalized.title)
      
      // Determine visibility based on classification
      const visibilityStatus = classification.autoFiltered ? "public" : "draft"

      await prisma.notice.create({
        data: {
          title: normalized.title,
          senderName: normalized.senderName,
          documentNumber: normalized.documentNumber,
          categoryMain: classification.categoryMain || "디지털",
          importanceLevel: classification.importanceLevel,
          sourceType: "official",
          registeredAt: normalized.registeredAt,
          summary: "", // normalizedRow doesn't provide summary currently
          visibilityStatus,
          tags: {
            create: classification.tags.map((tag: any) => ({
              tagType: tag.tagType,
              tagName: tag.tagName,
              tagSource: "auto",
            }))
          }
        }
      })
      
      count++
    }

    return NextResponse.json({ success: true, count })
  } catch (error) {
    console.error("CSV Upload Error:", error)
    return NextResponse.json({ error: "서버 내부 오류가 발생했습니다." }, { status: 500 })
  }
}
