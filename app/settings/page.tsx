"use client"

import { useState } from "react"
import { Brain, Bell, Shield, Palette, Globe, Download, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    assessmentReminders: true,
    marketingEmails: false,
    dataSharing: false,
    theme: "light",
    language: "en",
    timezone: "America/New_York",
  })

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Settings", current: true },
  ]

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
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
              <p className="text-xs text-slate-600">Account Settings</p>
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
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Account Settings</h1>
            <p className="text-slate-600">Manage your preferences and account settings</p>
          </div>

          <div className="space-y-8">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-slate-600" />
                  <CardTitle>Notifications</CardTitle>
                </div>
                <CardDescription>Choose what notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-slate-600">Receive assessment results and updates via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-slate-600">Receive browser notifications for important updates</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="assessment-reminders">Assessment Reminders</Label>
                    <p className="text-sm text-slate-600">Get reminded to take regular assessments</p>
                  </div>
                  <Switch
                    id="assessment-reminders"
                    checked={settings.assessmentReminders}
                    onCheckedChange={(checked) => handleSettingChange("assessmentReminders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-slate-600">Receive updates about new features and promotions</p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) => handleSettingChange("marketingEmails", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-slate-600" />
                  <CardTitle>Privacy & Security</CardTitle>
                </div>
                <CardDescription>Control your privacy and data sharing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-sharing">Anonymous Data Sharing</Label>
                    <p className="text-sm text-slate-600">Help improve our assessments by sharing anonymous data</p>
                  </div>
                  <Switch
                    id="data-sharing"
                    checked={settings.dataSharing}
                    onCheckedChange={(checked) => handleSettingChange("dataSharing", checked)}
                  />
                </div>

                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Download My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    View Privacy Policy
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Manage Cookie Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-slate-600" />
                  <CardTitle>Appearance</CardTitle>
                </div>
                <CardDescription>Customize how DataVine.ai looks and feels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => handleSettingChange("theme", value)}>
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Language & Region */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-slate-600" />
                  <CardTitle>Language & Region</CardTitle>
                </div>
                <CardDescription>Set your language and regional preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Trash2 className="h-5 w-5 text-red-600" />
                  <CardTitle className="text-red-900">Danger Zone</CardTitle>
                </div>
                <CardDescription className="text-red-700">Irreversible and destructive actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All Assessment Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-red-300 text-red-700 hover:bg-red-100 bg-transparent"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account Permanently
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Save Changes */}
          <div className="mt-8 flex justify-end space-x-4">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white">Save Changes</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
