"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Info, LogOut } from "lucide-react";

export function AppHeader() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const name = document.cookie
      .split("; ")
      .find(row => row.startsWith("research_user_name="))
      ?.split("=")[1];
    if (name) setUserName(decodeURIComponent(name));
  }, []);

  const handleLogout = () => {
    // 쿠키 삭제 (만료일을 과거로 설정)
    document.cookie = "research_user_name=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    // 로그인 페이지로 리다이렉트 및 상태 갱신
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:scale-110 transition-transform">
            <Info className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-800 tracking-tight">
            AI·디지털 공문 큐레이션
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          {userName && (
            <span className="hidden sm:inline-block text-sm text-slate-600 font-medium">
              <span className="font-bold text-slate-900">{userName}</span> 회원님 반갑습니다!
            </span>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors gap-2 font-semibold"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </Button>
        </div>
      </div>
    </header>
  );
}
