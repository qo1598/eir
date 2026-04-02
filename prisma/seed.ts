// prisma/seed.ts

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Clean up
  await prisma.noticeTag.deleteMany({})
  await prisma.interest.deleteMany({})
  await prisma.notice.deleteMany({})

  const notices = [
    {
      title: "2026학년도 초등 디지털 교육 실천연구회 모집 안내",
      senderName: "서울특별시교육청 디지털교육과",
      documentNumber: "디지털-2026-102",
      categoryMain: "디지털",
      importanceLevel: "high",
      sourceType: "official",
      registeredAt: new Date("2026-03-20"),
      deadlineAt: new Date("2026-04-15"),
      pinned: true,
      visibilityStatus: "public",
      summary: "디지털 기반 교육혁신을 선도할 실천연구회를 모집합니다. 활동비 500만원 지원 및 우수 사례 발표 기회 제공.",
      tags: {
        create: [
          { tagType: "participation", tagName: "연구회", tagSource: "auto" },
          { tagType: "participation", tagName: "모집", tagSource: "auto" },
          { tagType: "theme", tagName: "디지털", tagSource: "auto" },
        ]
      }
    },
    {
      title: "인공지능(AI) 디지털 교과서 활용 선도교사 연수 신청",
      senderName: "한국교육학술정보원(KERIS)",
      categoryMain: "AI",
      importanceLevel: "high",
      sourceType: "official",
      registeredAt: new Date("2026-03-25"),
      deadlineAt: new Date("2026-04-10"),
      visibilityStatus: "public",
      summary: "2026년 AI 디지털 교과서 도입을 대비한 선도교사 역량 강화 연수입니다. 숙박 및 여비 지원.",
      tags: {
        create: [
          { tagType: "participation", tagName: "연수", tagSource: "auto" },
          { tagType: "participation", tagName: "신청", tagSource: "auto" },
          { tagType: "theme", tagName: "AI", tagSource: "auto" },
        ]
      }
    },
    {
      title: "초등 정보교육(SW·AI) 캠프 운영 학교 공모",
      senderName: "경기도교육청 미래교육담당",
      documentNumber: "정보-2026-445",
      categoryMain: "정보",
      importanceLevel: "medium",
      sourceType: "official",
      registeredAt: new Date("2026-03-10"),
      deadlineAt: new Date("2026-04-05"),
      visibilityStatus: "public",
      summary: "학생들의 SW·AI 핵심 역량 강화를 위한 방학 중 캠프 운영 학교를 모집합니다.",
      tags: {
        create: [
          { tagType: "participation", tagName: "공모", tagSource: "auto" },
          { tagType: "theme", tagName: "SW", tagSource: "auto" },
          { tagType: "theme", tagName: "코딩", tagSource: "auto" },
        ]
      }
    },
    {
      title: "[직접등록] 에듀테크 박람회 무료 참관단 모집",
      senderName: "운영자",
      categoryMain: "디지털",
      importanceLevel: "medium",
      sourceType: "manual",
      registeredAt: new Date("2026-03-27"),
      deadlineAt: new Date("2026-05-20"),
      visibilityStatus: "public",
      summary: "최신 에듀테크 트렌드를 확인할 수 있는 박람회 참관단을 모집합니다. 단체 버스 제공.",
      tags: {
        create: [
          { tagType: "theme", tagName: "에듀테크", tagSource: "manual" },
          { tagType: "participation", tagName: "모집", tagSource: "manual" },
        ]
      }
    }
  ]

  for (const noticeData of notices) {
    await prisma.notice.create({
      data: noticeData
    })
  }

  console.log("Seed data created successfully.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
