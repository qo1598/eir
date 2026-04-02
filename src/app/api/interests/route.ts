// src/app/api/interests/route.ts

import { prisma } from "@/lib/db/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { noticeId, name, affiliation, interestType, memo } = body

    if (!noticeId || !name || !affiliation) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const interest = await prisma.interest.create({
      data: {
        noticeId,
        name,
        affiliation,
        interestType: interestType || "관심 있음",
        memo,
      },
    })

    return NextResponse.json(interest)
  } catch (error) {
    console.error("Interest creation error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
