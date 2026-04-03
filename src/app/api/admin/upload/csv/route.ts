// src/app/api/admin/upload/csv/route.ts

import { prisma } from "@/lib/db/prisma"
import { NextResponse } from "next/server"
import Papa from "papaparse"
import { normalizeRow } from "@/lib/csv/normalizeRow"
import { classifyNotice } from "@/lib/tagging/classifyNotice"
import crypto from "node:crypto"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const action = formData.get("action") as string || "upload" // default to upload for backward compatibility if needed, but we'll use 'parse' first

    if (action === "parse") {
      const file = formData.get("file") as File
      if (!file) {
        return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 })
      }

      const buffer = await file.arrayBuffer()
      
      // Try UTF-8 first
      let text = new TextDecoder("utf-8").decode(buffer)
      let results = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
      })

      // If parsing fails or garbled, try EUC-KR
      const firstRow = results.data[0] as any;
      const hasGarbledHeader = firstRow && Object.keys(firstRow).some(k => k.includes('') || k.includes('붿'));
      
      if (results.data.length === 0 || hasGarbledHeader) {
        text = new TextDecoder("euc-kr").decode(buffer)
        results = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        })
      }

      if (results.errors.length > 0) {
        console.error("CSV Parse Errors:", results.errors)
        return NextResponse.json({ error: "CSV 파싱 중 오류가 발생했습니다." }, { status: 400 })
      }

      const rows = results.data as any[]
      const filteredNotices: any[] = []

      // Filter and classify each row
      for (const row of rows) {
        const normalized = normalizeRow(row)
        if (!normalized.title) continue

        // Stricter filtering: must contain specific keywords
        const upperTitle = normalized.title.toUpperCase()
        const keywords = ["디지털", "AI", "인공지능", "SW", "소프트웨어", "정보"]
        const hasKeyword = keywords.some(k => upperTitle.includes(k.toUpperCase()))
        
        if (!hasKeyword) {
          continue
        }

        const classification = classifyNotice(normalized.title)
        
        filteredNotices.push({
          tempId: crypto.randomUUID(),
          title: normalized.title,
          senderName: normalized.senderName,
          documentNumber: normalized.documentNumber,
          categoryMain: classification.categoryMain || "디지털",
          importanceLevel: classification.importanceLevel,
          registeredAt: normalized.registeredAt,
          tags: classification.tags.map(t => ({
            tagType: t.tagType,
            tagName: t.tagName
          }))
        })
      }

      return NextResponse.json({ success: true, count: filteredNotices.length, data: filteredNotices })
    } 
    
    if (action === "upload") {
      const dataStr = formData.get("data") as string
      if (!dataStr) {
        return NextResponse.json({ error: "등록할 데이터가 없습니다." }, { status: 400 })
      }

      const noticesToInsert = JSON.parse(dataStr)
      const noticesData: any[] = []
      const tagsData: any[] = []

      for (const item of noticesToInsert) {
        const noticeId = crypto.randomUUID()
        
        noticesData.push({
          id: noticeId,
          title: item.title,
          senderName: item.senderName,
          documentNumber: item.documentNumber,
          categoryMain: item.categoryMain,
          importanceLevel: item.importanceLevel,
          sourceType: "official",
          registeredAt: item.registeredAt ? new Date(item.registeredAt) : null,
          summary: "",
          visibilityStatus: "public", // Approved ones are public
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        if (item.tags && Array.isArray(item.tags)) {
          item.tags.forEach((tag: any) => {
            tagsData.push({
              id: crypto.randomUUID(),
              noticeId: noticeId,
              tagType: tag.tagType,
              tagName: tag.tagName,
              tagSource: "auto",
              createdAt: new Date(),
            })
          })
        }
      }

      // Batch Insert with Chunking
      if (noticesData.length > 0) {
        const NOTICE_CHUNK_SIZE = 50
        for (let i = 0; i < noticesData.length; i += NOTICE_CHUNK_SIZE) {
          const chunk = noticesData.slice(i, i + NOTICE_CHUNK_SIZE)
          await prisma.notice.createMany({ data: chunk })
        }

        const TAG_CHUNK_SIZE = 100
        for (let i = 0; i < tagsData.length; i += TAG_CHUNK_SIZE) {
          const chunk = tagsData.slice(i, i + TAG_CHUNK_SIZE)
          await prisma.noticeTag.createMany({ data: chunk })
        }
      }

      return NextResponse.json({ success: true, count: noticesData.length })
    }

    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 })
  } catch (error) {
    console.error("CSV Upload Error:", error)
    return NextResponse.json({ error: "서버 내부 오류가 발생했습니다." }, { status: 500 })
  }
}
