"use client"

import { useState } from "react"
import { Brain, User, Mail, Phone, Calendar, Edit, Save, X } from "lucide-react"
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
    occupation: "Software Engineer",
    education: "Bachelor's Degree",
    location: "San Francisco, CA",
  })

  const [editedProfile, setEditedProfile] = useState(profile)

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Profile", current: true },
  ]

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

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
            <p className="text-slate-600">Manage your personal information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture and Basic Info */}
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={profile.name} />
                  <AvatarFallback className="bg-slate-900 text-white text-xl">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{profile.name}</CardTitle>
                <CardDescription>{profile.occupation}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="w-full mb-4 bg-transparent">
                  Change Photo
                </Button>
                <div className="text-sm text-slate-600 space-y-1">
                  <p>Member since January 2024</p>
                  <p>5 assessments completed</p>
                  <p>Premium subscriber</p>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave} className="bg-slate-900 hover:bg-slate-800 text-white">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={editedProfile.name}
                          onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center mt-2">
                          <User className="h-4 w-4 text-slate-400 mr-2" />
                          <span>{profile.name}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center mt-2">
                          <Mail className="h-4 w-4 text-slate-400 mr-2" />
                          <span>{profile.email}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={editedProfile.phone}
                          onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center mt-2">
                          <Phone className="h-4 w-4 text-slate-400 mr-2" />
                          <span>{profile.phone}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      {isEditing ? (
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={editedProfile.dateOfBirth}
                          onChange={(e) => setEditedProfile({ ...editedProfile, dateOfBirth: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center mt-2">
                          <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                          <span>{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="occupation">Occupation</Label>
                      {isEditing ? (
                        <Input
                          id="occupation"
                          value={editedProfile.occupation}
                          onChange={(e) => setEditedProfile({ ...editedProfile, occupation: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center mt-2">
                          <span className="ml-6">{profile.occupation}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="education">Education</Label>
                      {isEditing ? (
                        <Input
                          id="education"
                          value={editedProfile.education}
                          onChange={(e) => setEditedProfile({ ...editedProfile, education: e.target.value })}
                        />
                      ) : (
                        <div className="flex items-center mt-2">
                          <span className="ml-6">{profile.education}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={editedProfile.location}
                        onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center mt-2">
                        <span className="ml-6">{profile.location}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Account Security */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Account Security</CardTitle>
                  <CardDescription>Manage your password and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Enable Two-Factor Authentication
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
                  >
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
