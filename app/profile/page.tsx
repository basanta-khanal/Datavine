"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfilePictureUpload } from "@/components/profile-picture-upload"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Lock, 
  Bell, 
  Eye, 
  EyeOff,
  Shield,
  Settings,
  Globe,
  Palette,
  Download,
  Trash2,
  Edit,
  Plus,
  CheckCircle,
  AlertCircle,
  Info,
  Camera,
  Key,
  Smartphone,
  CreditCard,
  Activity,
  Award,
  Target,
  BookOpen,
  Zap,
  Moon,
  Sun,
  Monitor,
  Brain
} from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    website: "",
    dateOfBirth: "",
    gender: "",
    occupation: "",
    company: "",
    interests: [],
    timezone: "UTC",
    language: "English"
  })

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false
  })

  const [preferences, setPreferences] = useState({
    theme: "system",
    assessmentReminders: true,
    weeklyReports: true,
    privacyLevel: "standard",
    dataSharing: false,
    autoSave: true
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
          bio: userData.bio || "",
          location: userData.location || "",
          website: userData.website || "",
          dateOfBirth: userData.dateOfBirth || "",
          gender: userData.gender || "",
          occupation: userData.occupation || "",
          company: userData.company || "",
          interests: userData.interests || [],
          timezone: userData.timezone || "UTC",
          language: userData.language || "English"
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
    toast({
      title: "Profile picture updated",
      description: "Your profile picture has been successfully updated.",
    })
  }

  const handleFormChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSecurityChange = (field: string, value: string | boolean) => {
    setSecurityData(prev => ({ ...prev, [field]: value }))
  }

  const handlePreferencesChange = (field: string, value: string | boolean) => {
    setPreferences(prev => ({ ...prev, [field]: value }))
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

  const handleSaveSecurity = async () => {
    setIsSaving(true)
    
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirm password do not match.",
        variant: "destructive"
      })
      setIsSaving(false)
      return
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: "Security settings updated",
      description: "Your security preferences have been successfully saved.",
    })
    
    setSecurityData(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }))
    setIsSaving(false)
  }

  const handleSavePreferences = async () => {
    setIsSaving(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast({
      title: "Preferences updated",
      description: "Your preferences have been successfully saved.",
    })
    
    setIsSaving(false)
  }

  const addInterest = (interest: string) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }))
    }
  }

  const removeInterest = (interestToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Profile Not Found</h2>
          <p className="text-slate-600 mb-6">Please sign in to view your profile.</p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Dashboard</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Profile Settings
                </h1>
                <p className="text-sm text-slate-600">Manage your account and preferences</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Profile Overview */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <ProfilePictureUpload
                    currentPicture={user.profilePicture}
                    onPictureChange={handleProfilePictureChange}
                    userName={user.name}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full bg-white border-2 border-blue-200"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{user.name}</h2>
                  <p className="text-slate-600 mb-3">{user.email}</p>
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {user.subscription || "Free"} Plan
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Active
                    </Badge>
                    <span className="text-sm text-slate-600">
                      Member since {user.memberSince || "January 2024"}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {user.assessmentHistory?.length || 0}
                  </div>
                  <div className="text-sm text-slate-600">Assessments</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white p-1 rounded-xl shadow-sm">
              <TabsTrigger value="personal" className="rounded-lg">Personal Info</TabsTrigger>
              <TabsTrigger value="security" className="rounded-lg">Security</TabsTrigger>
              <TabsTrigger value="preferences" className="rounded-lg">Preferences</TabsTrigger>
              <TabsTrigger value="activity" className="rounded-lg">Activity</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-500" />
                    <span>Basic Information</span>
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>Full Name *</span>
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
                        <span>Email Address *</span>
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
                        <span>Date of Birth</span>
                      </label>
                      <Input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => handleFormChange("dateOfBirth", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Gender</label>
                      <Select value={formData.gender} onValueChange={(value) => handleFormChange("gender", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Occupation</label>
                      <Input
                        value={formData.occupation}
                        onChange={(e) => handleFormChange("occupation", e.target.value)}
                        placeholder="Enter your occupation"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Bio</label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => handleFormChange("bio", e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Company</label>
                      <Input
                        value={formData.company}
                        onChange={(e) => handleFormChange("company", e.target.value)}
                        placeholder="Enter your company name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Website</label>
                      <Input
                        value={formData.website}
                        onChange={(e) => handleFormChange("website", e.target.value)}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Interests</label>
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add an interest..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addInterest(e.currentTarget.value)
                              e.currentTarget.value = ''
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const input = document.querySelector('input[placeholder="Add an interest..."]') as HTMLInputElement
                            if (input && input.value) {
                              addInterest(input.value)
                              input.value = ''
                            }
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.interests.map((interest, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                          >
                            {interest}
                            <button
                              onClick={() => removeInterest(interest)}
                              className="ml-2 hover:text-blue-600"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Timezone</label>
                      <Select value={formData.timezone} onValueChange={(value) => handleFormChange("timezone", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">Eastern Time</SelectItem>
                          <SelectItem value="PST">Pacific Time</SelectItem>
                          <SelectItem value="GMT">GMT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Language</label>
                      <Select value={formData.language} onValueChange={(value) => handleFormChange("language", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="German">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-red-500" />
                    <span>Password & Security</span>
                  </CardTitle>
                  <CardDescription>
                    Update your password and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Current Password</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={securityData.currentPassword}
                          onChange={(e) => handleSecurityChange("currentPassword", e.target.value)}
                          placeholder="Enter current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">New Password</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={securityData.newPassword}
                          onChange={(e) => handleSecurityChange("newPassword", e.target.value)}
                          placeholder="Enter new password"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={securityData.confirmPassword}
                        onChange={(e) => handleSecurityChange("confirmPassword", e.target.value)}
                        placeholder="Confirm new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">Security Features</h4>
                    
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                          <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <Switch
                        checked={securityData.twoFactorEnabled}
                        onCheckedChange={(checked) => handleSecurityChange("twoFactorEnabled", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium text-slate-900">Email Notifications</p>
                          <p className="text-sm text-slate-600">Receive important security alerts via email</p>
                        </div>
                      </div>
                      <Switch
                        checked={securityData.emailNotifications}
                        onCheckedChange={(checked) => handleSecurityChange("emailNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="font-medium text-slate-900">Push Notifications</p>
                          <p className="text-sm text-slate-600">Get instant security alerts on your device</p>
                        </div>
                      </div>
                      <Switch
                        checked={securityData.pushNotifications}
                        onCheckedChange={(checked) => handleSecurityChange("pushNotifications", checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSaveSecurity}
                      disabled={isSaving}
                      className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{isSaving ? "Saving..." : "Save Security Settings"}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-purple-500" />
                    <span>App Preferences</span>
                  </CardTitle>
                  <CardDescription>
                    Customize your DataVine experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">Appearance</h4>
                    
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Palette className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-slate-900">Theme</p>
                          <p className="text-sm text-slate-600">Choose your preferred color scheme</p>
                        </div>
                      </div>
                      <Select value={preferences.theme} onValueChange={(value) => handlePreferencesChange("theme", value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">
                            <div className="flex items-center space-x-2">
                              <Sun className="h-4 w-4" />
                              <span>Light</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="dark">
                            <div className="flex items-center space-x-2">
                              <Moon className="h-4 w-4" />
                              <span>Dark</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="system">
                            <div className="flex items-center space-x-2">
                              <Monitor className="h-4 w-4" />
                              <span>System</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">Notifications</h4>
                    
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium text-slate-900">Assessment Reminders</p>
                          <p className="text-sm text-slate-600">Get reminded to complete regular assessments</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.assessmentReminders}
                        onCheckedChange={(checked) => handlePreferencesChange("assessmentReminders", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-slate-900">Weekly Reports</p>
                          <p className="text-sm text-slate-600">Receive weekly progress summaries</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.weeklyReports}
                        onCheckedChange={(checked) => handlePreferencesChange("weeklyReports", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="font-medium text-slate-900">Marketing Emails</p>
                          <p className="text-sm text-slate-600">Receive updates about new features and offers</p>
                        </div>
                      </div>
                      <Switch
                        checked={securityData.marketingEmails}
                        onCheckedChange={(checked) => handleSecurityChange("marketingEmails", checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900">Privacy & Data</h4>
                    
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="font-medium text-slate-900">Privacy Level</p>
                          <p className="text-sm text-slate-600">Control how much data is shared</p>
                        </div>
                      </div>
                      <Select value={preferences.privacyLevel} onValueChange={(value) => handlePreferencesChange("privacyLevel", value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="enhanced">Enhanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium text-slate-900">Data Sharing</p>
                          <p className="text-sm text-slate-600">Allow anonymous data sharing for research</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.dataSharing}
                        onCheckedChange={(checked) => handlePreferencesChange("dataSharing", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="font-medium text-slate-900">Auto-Save</p>
                          <p className="text-sm text-slate-600">Automatically save your progress</p>
                        </div>
                      </div>
                      <Switch
                        checked={preferences.autoSave}
                        onCheckedChange={(checked) => handlePreferencesChange("autoSave", checked)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSavePreferences}
                      disabled={isSaving}
                      className="bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>{isSaving ? "Saving..." : "Save Preferences"}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription>
                    Track your recent actions and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">Profile Updated</p>
                        <p className="text-sm text-slate-600">2 hours ago</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Brain className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">IQ Assessment Completed</p>
                        <p className="text-sm text-slate-600">1 day ago</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Score: 125</Badge>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg">
                      <div className="bg-yellow-100 p-2 rounded-full">
                        <Award className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">Achievement Unlocked</p>
                        <p className="text-sm text-slate-600">3 days ago</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">IQ Elite</Badge>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Target className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">New Goal Set</p>
                        <p className="text-sm text-slate-600">1 week ago</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">Focus Training</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Toaster />
    </div>
  )
}
