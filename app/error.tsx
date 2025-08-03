'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-red-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Something went wrong!</h2>
        <p className="text-slate-600 mb-6">
          We encountered an unexpected error. Please try again or contact support if the problem persists.
        </p>
        <div className="space-y-3">
          <Button onClick={reset} className="w-full bg-slate-900 hover:bg-slate-800 text-white">
            Try again
          </Button>
          <Button 
            onClick={() => window.location.href = '/'} 
            variant="outline" 
            className="w-full"
          >
            Go to Home
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-slate-500">Error Details (Development)</summary>
            <pre className="mt-2 p-3 bg-slate-100 rounded text-xs text-slate-700 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
} 