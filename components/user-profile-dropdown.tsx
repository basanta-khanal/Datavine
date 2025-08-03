"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { User, Settings, CreditCard, BarChart3, LogOut } from "lucide-react"

interface UserProfileDropdownProps {
  onNavigate?: (view: string) => void
  onLogout?: () => void
  userName?: string
  userEmail?: string
  profilePicture?: string | null
}

export const UserProfileDropdown = ({
  onNavigate,
  onLogout,
  userName = "John Doe",
  userEmail = "john.doe@example.com",
  profilePicture = null,
}: UserProfileDropdownProps) => {
  const handleNavigation = (view: string) => {
    if (onNavigate) {
      onNavigate(view)
    } else {
      // Default navigation for standalone usage
      window.location.href = `/${view}`
    }
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      // Default logout behavior
      console.log("Logging out...")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 p-0 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profilePicture || "/placeholder-avatar.jpg"} alt={userName} />
            <AvatarFallback className="bg-slate-900 text-white">
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleNavigation("dashboard")} className="cursor-pointer">
          <BarChart3 className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleNavigation("profile")} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleNavigation("settings")} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleNavigation("billing")} className="cursor-pointer">
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Payment Plans</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
