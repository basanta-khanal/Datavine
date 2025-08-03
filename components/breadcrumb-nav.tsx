"use client"

import { ChevronRight, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-600 mb-6">
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-1 text-slate-600 hover:text-slate-900"
        onClick={() => (window.location.href = "/")}
      >
        <Home className="h-4 w-4" />
      </Button>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 text-slate-400" />
          {item.current ? (
            <span className="font-medium text-slate-900">{item.label}</span>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-slate-600 hover:text-slate-900"
              onClick={() => item.href && (window.location.href = item.href)}
            >
              {item.label}
            </Button>
          )}
        </div>
      ))}
    </nav>
  )
}
