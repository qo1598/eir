// src/lib/tagging/keywordRules.ts

export const THEME_KEYWORDS = [
  "디지털",
  "AI",
  "인공지능",
  "정보",
  "SW",
  "소프트웨어",
  "에듀테크",
  "스마트기기",
  "코딩",
  "데이터",
  "컴퓨팅",
  "AI교육",
  "정보교육",
];

export const PARTICIPATION_KEYWORDS = [
  "연구회",
  "선도교사",
  "지원단",
  "연수",
  "공모",
  "모집",
  "신청",
  "운영단",
  "시범",
  "협의회",
  "발표회",
  "사례나눔",
  "워크숍",
  "동아리",
  "멘토단",
];

export const IMPORTANCE_RULES = {
  high: {
    themes: THEME_KEYWORDS,
    participation: PARTICIPATION_KEYWORDS, // Requires both
  },
  medium: {
    themes: THEME_KEYWORDS, // Only theme
  },
};
