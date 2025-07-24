"use client"

import { Brain, TrendingUp, Calendar, Award, BarChart3, Clock, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"

export default function DashboardPage() {
  const assessmentHistory = [
    { testType: "IQ Assessment", score: 125, date: "2024-01-20", status: "Completed" },
    { testType: "ADHD Assessment", score: 18, date: "2024-01-15", status: "Completed" },
    { testType: "Anxiety Assessment", score: 22, date: "2024-01-10", status: "Completed" },
    { testType: "ASD Assessment", score: 12, date: "2024-01-05", status: "Completed" },
  ]

  const upcomingGoals = [
    { goal: "Complete monthly IQ assessment", progress: 75, dueDate: "2024-02-01" },
    { goal: "Review anxiety coping strategies", progress: 50, dueDate: "2024-01-30" },
    { goal: "Practice mindfulness exercises", progress: 90, dueDate: "2024-01-28" },
  ]

  const breadcrumbItems = [{ label: "Dashboard", current: true }]

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
              <p className="text-xs text-slate-600">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/" className="text-slate-600 hover:text-slate-900">
              ← Back to Home
            </a>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <BreadcrumbNav items={breadcrumbItems} />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, John!</h1>
            <p className="text-slate-600">Here's an overview of your cognitive assessment journey.</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average IQ Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">125</div>
                <p className="text-xs text-muted-foreground">+3 points improvement</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Streak</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7 days</div>
                <p className="text-xs text-muted-foreground">Keep it up!</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">2 new this month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Assessments */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Assessments</CardTitle>
                <CardDescription>Your latest cognitive assessment results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assessmentHistory.map((assessment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-slate-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-slate-100 p-2 rounded-full">
                          <Brain className="h-4 w-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{assessment.testType}</p>
                          <p className="text-sm text-slate-600">{assessment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">{assessment.score}</p>
                        <p className="text-sm text-green-600">{assessment.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-transparent" variant="outline">
                  View All Results
                </Button>
              </CardContent>
            </Card>

            {/* Goals & Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Goals & Progress</CardTitle>
                <CardDescription>Track your cognitive development goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {upcomingGoals.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-900">{goal.goal}</p>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{goal.dueDate}</span>
                        </div>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <p className="text-sm text-slate-600">{goal.progress}% complete</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-transparent" variant="outline">
                  <Target className="h-4 w-4 mr-2" />
                  Set New Goal
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Start a new assessment or review your progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => (window.location.href = "/?test=iq")}
                >
                  <Brain className="h-6 w-6" />
                  <span>IQ Test</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  onClick={() => (window.location.href = "/?test=adhd")}
                >
                  <Brain className="h-6 w-6" />
                  <span>ADHD Test</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  onClick={() => (window.location.href = "/?test=asd")}
                >
                  <Brain className="h-6 w-6" />
                  <span>ASD Test</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  onClick={() => (window.location.href = "/?test=anxiety")}
                >
                  <Brain className="h-6 w-6" />
                  <span>Anxiety Test</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
