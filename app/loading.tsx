import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="bg-slate-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-slate-600 animate-spin" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Loading...</h2>
        <p className="text-slate-600">Please wait while we prepare your assessment.</p>
      </div>
    </div>
  )
} 