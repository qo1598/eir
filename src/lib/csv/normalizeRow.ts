// src/lib/csv/normalizeRow.ts

import { RawCsvRow } from "./parseCsv";

export interface NormalizedNotice {
  title: string;
  senderName?: string;
  documentNumber?: string;
  registeredAt?: Date;
  rawTitle: string;
}

export function normalizeRow(row: RawCsvRow): NormalizedNotice {
  // Common Korean CSV field mappings for "문서등록대장"
  const titleKeys = ["제목", "과제명", "Title"];
  const senderKeys = ["발신기관", "담당부서", "기안자", "보낸이", "Sender"];
  const docNumKeys = ["등록번호", "문서번호", "번호", "No"];
  const dateKeys = ["등록일자", "결재일자", "일자", "등록일", "Date"];

  const findValue = (keys: string[]) => {
    const key = keys.find(k => row[k]);
    return key ? row[key].trim() : undefined;
  };

  const title = findValue(titleKeys) || "";
  const senderName = findValue(senderKeys);
  const documentNumber = findValue(docNumKeys);
  const dateStr = findValue(dateKeys);
  
  let registeredAt: Date | undefined = undefined;
  if (dateStr) {
    const parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate.getTime())) {
      registeredAt = parsedDate;
    }
  }

  return {
    title,
    senderName,
    documentNumber,
    registeredAt,
    rawTitle: title,
  };
}
