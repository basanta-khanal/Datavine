'use client'

import { Button } from "@/components/ui/button"
import { Brain } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="bg-slate-900 p-3 rounded-xl shadow-sm w-fit mx-auto mb-6">
          <Brain className="h-8 w-8 text-white" />
        </div>
        
        <h1 className="text-4xl font-bold text-slate-900 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-slate-700 mb-2">Page Not Found</h2>
        <p className="text-slate-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link href="/">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white">
            Go Back Home
          </Button>
        </Link>
      </div>
    </div>
  )
} 