"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfilePictureUpload } from "@/components/profile-picture-upload"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ArrowLeft, Save, User, Mail, Phone, Calendar } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem("datavine_user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
        })
      } catch (error) {
        console.error("Failed to parse user data:", error)
      }
    }
    setIsLoading(false)
  }, [])

  const handleProfilePictureChange = (picture: string | null) => {
    const updatedUser = { ...user, profilePicture: picture }
    setUser(updatedUser)
    localStorage.setItem("datavine_user", JSON.stringify(updatedUser))
  }

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const updatedUser = { ...user, ...formData }
    setUser(updatedUser)
    localStorage.setItem("datavine_user", JSON.stringify(updatedUser))
    
    setIsSaving(false)
    toast({
      title: "Profile updated",
      description: "Your profile information has been successfully saved.",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Profile Not Found</h2>
          <p className="text-slate-600 mb-6">Please sign in to view your profile.</p>
          <Link href="/">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                <p className="text-sm text-slate-600">Manage your account information</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Picture Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Picture</span>
              </CardTitle>
              <CardDescription>
                Upload a profile picture to personalize your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfilePictureUpload
                currentPicture={user.profilePicture}
                onPictureChange={handleProfilePictureChange}
                userName={user.name}
              />
            </CardContent>
          </Card>

          {/* Personal Information Section */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Full Name</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Email Address</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange("email", e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>Phone Number</span>
                  </label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => handleFormChange("phone", e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Member Since</span>
                  </label>
                  <Input
                    value={user.memberSince || "January 2024"}
                    disabled
                    className="bg-slate-50"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-slate-900 hover:bg-slate-800 text-white flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Information Section */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Your account details and subscription information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Subscription Plan</label>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">{user.subscription || "Free"}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Subscription Expiry</label>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">{user.subscriptionExpiry || "N/A"}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Assessments Completed</label>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="font-medium">
                      {user.assessmentHistory?.length || 0} assessments
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Account Status</label>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-green-700">Active</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Toaster />
    </div>
  )
}
