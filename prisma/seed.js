const { PrismaClient } = require("@prisma/client")
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
    }
  ]

  for (const noticeData of notices) {
    const notice = await prisma.notice.create({
      data: noticeData
    })
    
    // Add some tags manually for seed
    await prisma.noticeTag.create({
      data: {
        noticeId: notice.id,
        tagType: "theme",
        tagName: noticeData.categoryMain,
        tagSource: "auto"
      }
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
