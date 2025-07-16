'use client'

import { useRouter } from 'next/navigation'

interface BackButtonProps {
  className?: string
  children?: React.ReactNode
}

export default function BackButton({ 
  className = "inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors",
  children = "← Back"
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handleBack}
        className={className}
      >
        {children}
      </button>
    </div>
  )
} 