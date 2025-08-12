"use client"

import { useState, useEffect } from "react"
import { 
  Brain, 
  TrendingUp, 
  Calendar, 
  Award, 
  BarChart3, 
  Clock, 
  Target, 
  Users, 
  Activity, 
  Zap, 
  BookOpen, 
  Lightbulb, 
  Trophy, 
  Star, 
  ChevronRight, 
  Plus,
  Eye,
  Download,
  Share2,
  Settings,
  Bell,
  Search,
  Filter,
  ArrowUpRight,
  TrendingDown,
  Minus,
  CheckCircle,
  AlertCircle,
  Info,
  Circle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedTimeframe, setSelectedTimeframe] = useState("month")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data - in real app, this would come from API
  const userProfile = {
    name: "John Smith",
    email: "john.smith@email.com",
    avatar: "/api/placeholder/40/40",
    subscription: "premium",
    joinDate: "2024-01-01",
    totalAssessments: 24,
    averageScore: 127,
    improvement: "+8",
    streak: 12,
    achievements: 8,
    level: "Expert",
    experience: 2450
  }

  const assessmentHistory = [
    { 
      id: 1,
      testType: "IQ Assessment", 
      score: 125, 
      maxScore: 150,
      percentage: 83,
      date: "2024-01-20", 
      status: "Completed",
      timeSpent: 45,
      category: "cognitive",
      trend: "up",
      aiInsights: "Strong analytical thinking, consider advanced problem-solving exercises"
    },
    { 
      id: 2,
      testType: "ADHD Assessment", 
      score: 18, 
      maxScore: 54,
      percentage: 67,
      date: "2024-01-15", 
      status: "Completed",
      timeSpent: 30,
      category: "behavioral",
      trend: "down",
      aiInsights: "Improved focus patterns, continue with current strategies"
    },
    { 
      id: 3,
      testType: "Anxiety Assessment", 
      score: 22, 
      maxScore: 63,
      percentage: 65,
      date: "2024-01-10", 
      status: "Completed",
      timeSpent: 25,
      category: "emotional",
      trend: "stable",
      aiInsights: "Good emotional regulation, mindfulness practice recommended"
    },
    { 
      id: 4,
      testType: "ASD Assessment", 
      score: 12, 
      maxScore: 50,
      percentage: 76,
      date: "2024-01-05", 
      status: "Completed",
      timeSpent: 35,
      category: "developmental",
      trend: "up",
      aiInsights: "Excellent social awareness, continue social skills development"
    },
    { 
      id: 5,
      testType: "Memory Test", 
      score: 89, 
      maxScore: 100,
      percentage: 89,
      date: "2024-01-01", 
      status: "Completed",
      timeSpent: 20,
      category: "cognitive",
      trend: "up",
      aiInsights: "Outstanding memory performance, consider advanced memory techniques"
    }
  ]

  const upcomingGoals = [
    { 
      id: 1,
      goal: "Complete monthly IQ assessment", 
      progress: 75, 
      dueDate: "2024-02-01",
      priority: "high",
      category: "cognitive",
      description: "Regular IQ testing to track cognitive development"
    },
    { 
      id: 2,
      goal: "Review anxiety coping strategies", 
      progress: 50, 
      dueDate: "2024-01-30",
      priority: "medium",
      category: "emotional",
      description: "Practice and refine anxiety management techniques"
    },
    { 
      id: 3,
      goal: "Practice mindfulness exercises", 
      progress: 90, 
      dueDate: "2024-01-28",
      priority: "low",
      category: "wellness",
      description: "Daily mindfulness practice for mental clarity"
    },
    { 
      id: 4,
      goal: "Complete ADHD focus training", 
      progress: 30, 
      dueDate: "2024-02-05",
      priority: "high",
      category: "behavioral",
      description: "Structured focus training program"
    }
  ]

  const aiRecommendations = [
    {
      id: 1,
      type: "assessment",
      title: "Try Advanced Problem Solving",
      description: "Based on your IQ results, you'd benefit from advanced logical reasoning exercises",
      priority: "high",
      category: "cognitive",
      action: "Start Assessment"
    },
    {
      id: 2,
      type: "exercise",
      title: "Mindfulness Meditation",
      description: "Your anxiety scores suggest daily mindfulness practice could be beneficial",
      priority: "medium",
      category: "wellness",
      action: "Begin Practice"
    },
    {
      id: 3,
      type: "resource",
      title: "Focus Enhancement Techniques",
      description: "ADHD assessment indicates room for focus improvement strategies",
      priority: "medium",
      category: "behavioral",
      action: "Learn More"
    }
  ]

  const achievements = [
    { id: 1, name: "First Assessment", description: "Completed your first cognitive assessment", icon: "🎯", unlocked: true, date: "2024-01-01" },
    { id: 2, name: "Streak Master", description: "Maintained a 7-day assessment streak", icon: "🔥", unlocked: true, date: "2024-01-07" },
    { id: 3, name: "IQ Elite", description: "Scored above 120 on IQ assessment", icon: "🧠", unlocked: true, date: "2024-01-20" },
    { id: 4, name: "Consistent Learner", description: "Completed 10 assessments", icon: "📚", unlocked: true, date: "2024-01-15" },
    { id: 5, name: "Wellness Warrior", description: "Completed all wellness assessments", icon: "💪", unlocked: false, date: null },
    { id: 6, name: "Speed Demon", description: "Complete assessment in under 20 minutes", icon: "⚡", unlocked: false, date: null }
  ]

  const recentActivity = [
    { id: 1, action: "Completed IQ Assessment", time: "2 hours ago", type: "assessment", score: 125 },
    { id: 2, action: "Set new goal: Focus Training", time: "1 day ago", type: "goal" },
    { id: 3, action: "Achievement unlocked: IQ Elite", time: "2 days ago", type: "achievement" },
    { id: 4, action: "Completed ADHD Assessment", time: "1 week ago", type: "assessment", score: 18 },
    { id: 5, action: "Updated profile information", time: "1 week ago", type: "profile" }
  ]

  const breadcrumbItems = [{ label: "Dashboard", current: true }]

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-600" />
  }

  const getPriorityColor = (priority: string) => {
    if (priority === "high") return "bg-red-100 text-red-800"
    if (priority === "medium") return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DataVine.ai
                </h1>
                <p className="text-xs text-slate-600">Cognitive Intelligence Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search assessments, goals..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
              
              <Avatar className="h-10 w-10">
                <AvatarImage src={userProfile.avatar} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <BreadcrumbNav items={breadcrumbItems} />

          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome back, {userProfile.name}! 👋</h1>
                <p className="text-blue-100 text-lg mb-4">
                  You're making excellent progress in your cognitive development journey.
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-300" />
                    <span className="font-semibold">Level {userProfile.level}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-300" />
                    <span className="font-semibold">{userProfile.experience} XP</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-yellow-300" />
                    <span className="font-semibold">{userProfile.achievements} Achievements</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white/20 rounded-full px-6 py-3">
                  <p className="text-sm text-blue-100">Current Streak</p>
                  <p className="text-3xl font-bold">{userProfile.streak} days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-5 bg-white p-1 rounded-xl shadow-sm">
              <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
              <TabsTrigger value="assessments" className="rounded-lg">Assessments</TabsTrigger>
              <TabsTrigger value="goals" className="rounded-lg">Goals</TabsTrigger>
              <TabsTrigger value="insights" className="rounded-lg">AI Insights</TabsTrigger>
              <TabsTrigger value="progress" className="rounded-lg">Progress</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-800">Total Assessments</CardTitle>
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-900">{userProfile.totalAssessments}</div>
                    <p className="text-xs text-blue-700">+2 from last month</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-green-800">Average Score</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-900">{userProfile.averageScore}</div>
                    <p className="text-xs text-green-700">{userProfile.improvement} points improvement</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-800">Current Streak</CardTitle>
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-900">{userProfile.streak} days</div>
                    <p className="text-xs text-purple-700">Personal best!</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-orange-800">Achievements</CardTitle>
                    <Award className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-900">{userProfile.achievements}</div>
                    <p className="text-xs text-orange-700">2 new this month</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <span>Quick Actions</span>
                    </CardTitle>
                    <CardDescription>Start a new assessment or review your progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        className="h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        onClick={() => (window.location.href = "/?test=iq")}
                      >
                        <Brain className="h-6 w-6" />
                        <span className="font-semibold">IQ Test</span>
                        <span className="text-xs opacity-90">15-20 min</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center space-y-2 border-2 hover:bg-slate-50"
                        onClick={() => (window.location.href = "/?test=adhd")}
                      >
                        <Activity className="h-6 w-6" />
                        <span className="font-semibold">ADHD Test</span>
                        <span className="text-xs text-slate-600">10-15 min</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center space-y-2 border-2 hover:bg-slate-50"
                        onClick={() => (window.location.href = "/?test=asd")}
                      >
                        <Users className="h-6 w-6" />
                        <span className="font-semibold">ASD Test</span>
                        <span className="text-xs text-slate-600">20-25 min</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center space-y-2 border-2 hover:bg-slate-50"
                        onClick={() => (window.location.href = "/?test=anxiety")}
                      >
                        <BookOpen className="h-6 w-6" />
                        <span className="font-semibold">Anxiety Test</span>
                        <span className="text-xs text-slate-600">15-20 min</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <span>Recent Activity</span>
                    </CardTitle>
                    <CardDescription>Your latest actions and achievements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.slice(0, 5).map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50">
                          <div className="bg-blue-100 p-2 rounded-full">
                            {activity.type === 'assessment' && <Brain className="h-4 w-4 text-blue-600" />}
                            {activity.type === 'goal' && <Target className="h-4 w-4 text-green-600" />}
                            {activity.type === 'achievement' && <Award className="h-4 w-4 text-yellow-600" />}
                            {activity.type === 'profile' && <Users className="h-4 w-4 text-purple-600" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">{activity.action}</p>
                            <p className="text-sm text-slate-600">{activity.time}</p>
                          </div>
                          {activity.score && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {activity.score}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View All Activity
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* AI Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    <span>AI-Powered Recommendations</span>
                  </CardTitle>
                  <CardDescription>Personalized suggestions based on your assessment results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {aiRecommendations.map((rec) => (
                      <div key={rec.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority}
                          </Badge>
                          <Badge variant="outline">{rec.category}</Badge>
                        </div>
                        <h4 className="font-semibold text-slate-900 mb-2">{rec.title}</h4>
                        <p className="text-sm text-slate-600 mb-4">{rec.description}</p>
                        <Button size="sm" className="w-full">
                          {rec.action}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Assessments Tab */}
            <TabsContent value="assessments" className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Assessment History</h2>
                  <p className="text-slate-600">Track your cognitive development over time</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Week</SelectItem>
                      <SelectItem value="month">Month</SelectItem>
                      <SelectItem value="quarter">Quarter</SelectItem>
                      <SelectItem value="year">Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Assessment
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {assessmentHistory.map((assessment) => (
                  <Card key={assessment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                            <Brain className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-900 text-lg">{assessment.testType}</h3>
                            <div className="flex items-center space-x-4 text-sm text-slate-600">
                              <span>{assessment.date}</span>
                              <span>•</span>
                              <span>{assessment.timeSpent} minutes</span>
                              <span>•</span>
                              <span className="capitalize">{assessment.category}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            {getTrendIcon(assessment.trend)}
                            <span className="text-2xl font-bold text-slate-900">{assessment.score}</span>
                            <span className="text-slate-600">/ {assessment.maxScore}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress value={assessment.percentage} className="w-20 h-2" />
                            <span className={`text-sm font-semibold ${getScoreColor(assessment.percentage)}`}>
                              {assessment.percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium text-slate-900">AI Insights</span>
                        </div>
                        <p className="text-sm text-slate-700">{assessment.aiInsights}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {assessment.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals" className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Goals & Progress</h2>
                  <p className="text-slate-600">Set and track your cognitive development objectives</p>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Set New Goal
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Goals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-green-500" />
                      <span>Active Goals</span>
                    </CardTitle>
                    <CardDescription>Your current objectives and progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {upcomingGoals.map((goal) => (
                        <div key={goal.id} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Badge className={getPriorityColor(goal.priority)}>
                                {goal.priority}
                              </Badge>
                              <Badge variant="outline">{goal.category}</Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-slate-600">
                              <Clock className="h-4 w-4" />
                              <span>{goal.dueDate}</span>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 mb-1">{goal.goal}</h4>
                            <p className="text-sm text-slate-600 mb-3">{goal.description}</p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Progress</span>
                                <span className="font-semibold">{goal.progress}%</span>
                              </div>
                              <Progress value={goal.progress} className="h-2" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Goal Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                      <span>Goal Statistics</span>
                    </CardTitle>
                    <CardDescription>Overview of your goal completion</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">3</div>
                          <div className="text-sm text-green-700">Active Goals</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">75%</div>
                          <div className="text-blue-700">Avg. Progress</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-900">Goal Categories</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Cognitive</span>
                            <span className="font-semibold">2 goals</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Behavioral</span>
                            <span className="font-semibold">1 goal</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Wellness</span>
                            <span className="font-semibold">1 goal</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* AI Insights Tab */}
            <TabsContent value="insights" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">AI-Powered Insights</h2>
                <p className="text-slate-600">Personalized analysis and recommendations based on your data</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cognitive Profile */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-purple-500" />
                      <span>Cognitive Profile</span>
                    </CardTitle>
                    <CardDescription>Your cognitive strengths and areas for improvement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-2">Strengths</h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>• Strong analytical thinking</li>
                          <li>• Excellent memory retention</li>
                          <li>• Good problem-solving skills</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <h4 className="font-semibold text-yellow-800 mb-2">Areas for Growth</h4>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>• Focus and attention span</li>
                          <li>• Emotional regulation</li>
                          <li>• Social interaction skills</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personalized Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      <span>Personalized Recommendations</span>
                    </CardTitle>
                    <CardDescription>AI-generated suggestions for your development</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {aiRecommendations.map((rec) => (
                        <div key={rec.id} className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <Badge className={getPriorityColor(rec.priority)}>
                              {rec.priority}
                            </Badge>
                            <Badge variant="outline">{rec.category}</Badge>
                          </div>
                          <h4 className="font-semibold text-slate-900 mb-2">{rec.title}</h4>
                          <p className="text-sm text-slate-600 mb-3">{rec.description}</p>
                          <Button size="sm" className="w-full">
                            {rec.action}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span>Progress Trends</span>
                  </CardTitle>
                  <CardDescription>Your cognitive development over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-slate-500">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                      <p>Interactive charts coming soon</p>
                      <p className="text-sm">Track your progress with visual analytics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Progress Tracking</h2>
                <p className="text-slate-600">Monitor your cognitive development journey</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <span>Achievements</span>
                    </CardTitle>
                    <CardDescription>Unlock achievements as you progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {achievements.map((achievement) => (
                        <div key={achievement.id} className={`text-center p-4 rounded-lg border-2 ${
                          achievement.unlocked 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-slate-50 border-slate-200'
                        }`}>
                          <div className="text-3xl mb-2">{achievement.icon}</div>
                          <h4 className={`font-semibold mb-1 ${
                            achievement.unlocked ? 'text-green-800' : 'text-slate-400'
                          }`}>
                            {achievement.name}
                          </h4>
                          <p className={`text-xs ${
                            achievement.unlocked ? 'text-green-700' : 'text-slate-500'
                          }`}>
                            {achievement.description}
                          </p>
                          {achievement.unlocked && achievement.date && (
                            <p className="text-xs text-green-600 mt-2">
                              Unlocked {achievement.date}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Path */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      <span>Learning Path</span>
                    </CardTitle>
                    <CardDescription>Your personalized learning journey</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-500 p-2 rounded-full">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">Foundation Assessment</h4>
                          <p className="text-sm text-slate-600">Complete initial cognitive evaluation</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Completed</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-500 p-2 rounded-full">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900">Specialized Testing</h4>
                          <p className="text-sm text-slate-600">Focus on specific cognitive areas</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="bg-slate-300 p-2 rounded-full">
                          <Circle className="h-4 w-4 text-slate-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-400">Advanced Analysis</h4>
                          <p className="text-sm text-slate-500">Deep dive into cognitive patterns</p>
                        </div>
                        <Badge variant="outline" className="text-slate-400">Locked</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-purple-500" />
                    <span>Progress Summary</span>
                  </CardTitle>
                  <CardDescription>Comprehensive overview of your development</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600 mb-2">24</div>
                      <div className="text-blue-800 font-semibold">Total Assessments</div>
                      <div className="text-blue-600 text-sm">+3 this month</div>
                    </div>
                    
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                      <div className="text-3xl font-bold text-green-600 mb-2">127</div>
                      <div className="text-green-800 font-semibold">Average Score</div>
                      <div className="text-green-600 text-sm">+8 improvement</div>
                    </div>
                    
                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                      <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
                      <div className="text-purple-800 font-semibold">Day Streak</div>
                      <div className="text-purple-600 text-sm">Personal best!</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
