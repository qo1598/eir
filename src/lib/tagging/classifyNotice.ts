// src/lib/tagging/classifyNotice.ts

import { THEME_KEYWORDS, PARTICIPATION_KEYWORDS } from "./keywordRules";

export interface ClassificationResult {
  categoryMain: string | null;
  importanceLevel: "high" | "medium" | "low";
  tags: { tagType: string; tagName: string; tagSource: "auto" }[];
  autoFiltered: boolean;
}

export function classifyNotice(title: string): ClassificationResult {
  const normalizedTitle = title.toLowerCase();
  
  // 1. Theme Check (Auto-filtering)
  const matchedThemes = THEME_KEYWORDS.filter(k => normalizedTitle.includes(k.toLowerCase()));
  const hasTheme = matchedThemes.length > 0;
  
  // 2. Participation Check
  const matchedParticipation = PARTICIPATION_KEYWORDS.filter(k => normalizedTitle.includes(k.toLowerCase()));
  const hasParticipation = matchedParticipation.length > 0;
  
  // 3. Category Main
  // We'll pick the first matched theme as the main category, or '디지털' if multiple types match
  let categoryMain: string | null = null;
  if (hasTheme) {
    if (matchedThemes.some(t => ["AI", "인공지능"].includes(t))) categoryMain = "AI";
    else if (matchedThemes.some(t => ["정보", "SW", "소프트웨어", "코딩"].includes(t))) categoryMain = "정보";
    else categoryMain = "디지털";
  }

  // 4. Importance Level
  let importanceLevel: "high" | "medium" | "low" = "low";
  if (hasTheme && hasParticipation) {
    importanceLevel = "high";
  } else if (hasTheme) {
    importanceLevel = "medium";
  }

  // 5. Tags
  const tags: { tagType: string; tagName: string; tagSource: "auto" }[] = [];
  
  // Theme Tags
  matchedThemes.forEach(name => {
    tags.push({ tagType: "theme", tagName: name, tagSource: "auto" });
  });
  
  // Participation Tags
  matchedParticipation.forEach(name => {
    tags.push({ tagType: "participation", tagName: name, tagSource: "auto" });
  });

  return {
    categoryMain,
    importanceLevel,
    tags,
    autoFiltered: hasTheme,
  };
}
