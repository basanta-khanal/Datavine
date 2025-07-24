"use client"

import { useState } from "react"
import { Brain, User, Mail, Phone, Calendar, MapPin, Edit3, Save, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1990-05-15",
    location: "New York, NY",
    bio: "Passionate about cognitive development and mental health awareness. Regular user of DataVine.ai assessments.",
    joinDate: "January 2024",
    totalAssessments: 12,
    averageIQ: 125,
    subscription: "Premium",
  })

  const [editedProfile, setEditedProfile] = useState(profile)

  const handleEdit = () => {
    setIsEditing(true)
    setEditedProfile(profile)
  }

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "My Profile", current: true },
  ]

  return (
    <div className="min-h-screen bg-white">
      <header className="container mx-auto px-4 py-6 border-b border-slate-100">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-900 p-2.5 rounded-xl shadow-sm">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">DataVine.ai</h1>
              <p className="text-xs text-slate-600">My Profile</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/dashboard" className="text-slate-600 hover:text-slate-900">
              ← Back to Dashboard
            </a>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <BreadcrumbNav items={breadcrumbItems} />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Profile</h1>
            <p className="text-slate-600">Manage your personal information and preferences.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <Card className="lg:col-span-1">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder-avatar.jpg" alt={profile.name} />
                    <AvatarFallback className="bg-slate-900 text-white text-xl">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>{profile.name}</CardTitle>
                <CardDescription>
                  {profile.subscription} Member since {profile.joinDate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-900">{profile.totalAssessments}</p>
                    <p className="text-sm text-slate-600">Total Assessments</p>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <p className="text-2xl font-bold text-slate-900">{profile.averageIQ}</p>
                    <p className="text-sm text-slate-600">Average IQ Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and contact information</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={handleEdit} variant="outline" size="sm">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={handleSave} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={editedProfile.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2 border border-slate-200 rounded-md bg-slate-50">
                          <User className="h-4 w-4 text-slate-500" />
                          <span>{profile.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2 border border-slate-200 rounded-md bg-slate-50">
                          <Mail className="h-4 w-4 text-slate-500" />
                          <span>{profile.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={editedProfile.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2 border border-slate-200 rounded-md bg-slate-50">
                          <Phone className="h-4 w-4 text-slate-500" />
                          <span>{profile.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      {isEditing ? (
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={editedProfile.dateOfBirth}
                          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2 border border-slate-200 rounded-md bg-slate-50">
                          <Calendar className="h-4 w-4 text-slate-500" />
                          <span>{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="location">Location</Label>
                      {isEditing ? (
                        <Input
                          id="location"
                          value={editedProfile.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2 border border-slate-200 rounded-md bg-slate-50">
                          <MapPin className="h-4 w-4 text-slate-500" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      {isEditing ? (
                        <textarea
                          id="bio"
                          className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                          rows={3}
                          value={editedProfile.bio}
                          onChange={(e) => handleInputChange("bio", e.target.value)}
                        />
                      ) : (
                        <div className="p-2 border border-slate-200 rounded-md bg-slate-50">
                          <span>{profile.bio}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Settings */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences and security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Privacy Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">Email notifications</span>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">Data sharing preferences</span>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">Assessment history visibility</span>
                      <Button variant="outline" size="sm">
                        Settings
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900">Security</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">Change password</span>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">Two-factor authentication</span>
                      <Button variant="outline" size="sm">
                        Enable
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">Login sessions</span>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
