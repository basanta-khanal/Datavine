"use client"

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"

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
    <nav className="flex items-center space-x-1 text-sm text-slate-600 mb-6">
      <Link href="/" className="flex items-center hover:text-slate-900 transition-colors">
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-4 w-4 text-slate-400" />
          {item.href && !item.current ? (
            <Link href={item.href} className="hover:text-slate-900 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className={item.current ? "text-slate-900 font-medium" : ""}>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
