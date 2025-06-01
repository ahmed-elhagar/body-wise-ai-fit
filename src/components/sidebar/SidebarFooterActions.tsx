
import { LogOut } from "lucide-react"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { useI18n } from "@/hooks/useI18n"
import { useAuth } from "@/hooks/useAuth"
import LanguageToggle from "../LanguageToggle"

const SidebarFooterActions = () => {
  const { t } = useI18n()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="space-y-2">
      <LanguageToggle />
      <SidebarMenuButton 
        onClick={handleSignOut}
        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <LogOut className="h-4 w-4 mr-2" />
        <span className="font-medium">{t("Sign Out")}</span>
      </SidebarMenuButton>
    </div>
  )
}

export default SidebarFooterActions
