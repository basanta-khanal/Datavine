"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Camera, X, User } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ProfilePictureUploadProps {
  currentPicture?: string | null
  onPictureChange: (picture: string | null) => void
  userName?: string
}

export const ProfilePictureUpload = ({
  currentPicture,
  onPictureChange,
  userName = "User",
}: ProfilePictureUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, etc.)",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        onPictureChange(imageData)
        setIsUploading(false)
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been successfully updated.",
        })
      }
      reader.onerror = () => {
        setIsUploading(false)
        toast({
          title: "Upload failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePicture = () => {
    onPictureChange(null)
    toast({
      title: "Profile picture removed",
      description: "Your profile picture has been removed.",
    })
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Profile picture display */}
      <div className="relative">
        <Avatar className="h-24 w-24 border-4 border-slate-200 shadow-lg">
          <AvatarImage 
            src={currentPicture || "/placeholder-avatar.jpg"} 
            alt={userName} 
          />
          <AvatarFallback className="bg-slate-900 text-white text-xl">
            {userName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        {/* Upload overlay */}
        {!currentPicture && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 hover:opacity-100 transition-opacity">
            <Camera className="h-6 w-6 text-white" />
          </div>
        )}
      </div>

      {/* Upload/Remove buttons */}
      <div className="flex space-x-2">
        <Button
          onClick={triggerFileInput}
          disabled={isUploading}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <Upload className="h-4 w-4" />
          <span>{isUploading ? "Uploading..." : "Upload Photo"}</span>
        </Button>
        
        {currentPicture && (
          <Button
            onClick={handleRemovePicture}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
            <span>Remove</span>
          </Button>
        )}
      </div>

      {/* Help text */}
      <p className="text-xs text-slate-500 text-center max-w-xs">
        Upload a profile picture (JPEG, PNG). Maximum file size: 5MB.
      </p>
    </div>
  )
} 