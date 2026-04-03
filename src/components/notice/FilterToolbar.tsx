// src/components/notice/FilterToolbar.tsx

"use client"

import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function FilterToolbar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "")
  
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(name, value)
      else params.delete(name)
      return params.toString()
    },
    [searchParams]
  )

  const handleTabChange = (value: string) => {
    router.push(pathname + "?" + createQueryString("category", value === "all" ? "" : value))
  }

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      router.push(pathname + "?" + createQueryString("q", searchValue))
    }, 300)
    
    return () => clearTimeout(handler)
  }, [searchValue, router, pathname, createQueryString])

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="공문 제목으로 검색..." 
            className="pl-9 pr-10 h-11"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {searchValue && (
            <button 
              type="button" 
              onClick={() => {
                setSearchValue("")
                router.push(pathname)
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
