'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import ChangePassword from "./utils/change-password"

interface SettingsDropdownProps {
  userType: string
}

export function SettingsDropdown({ userType }: SettingsDropdownProps) {
  // State to control the change password dialog
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="hover:bg-gray-100 p-2 rounded-full">
          <Settings className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* Show Match History for clients only */}
          {userType !== "advisor" && (
            <DropdownMenuItem asChild>
              <Link href="/history">Match History</Link>
            </DropdownMenuItem>
          )}
          {/* Change Password option */}
          <DropdownMenuItem onSelect={() => setShowPasswordDialog(true)}>
            Change Password
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Change Password Dialog */}
      {showPasswordDialog && (
        <ChangePassword onClose={() => setShowPasswordDialog(false)} />
      )}
    </>
  )
} 