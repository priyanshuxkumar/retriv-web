'use client'

import Link from "next/link"
import { Settings2, UserRoundSearch, Bot, Logs, Lock } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import UserProfile from "./UserProfile"

interface MenuItemProps {
  href: string
  icon: React.ReactNode
  label: string
  onClick: () => void
}

interface MobileMenuItemsProps {
  onItemClick: () => void
}
  

const MenuItem = ({ href, icon, label, onClick }: MenuItemProps) => {
  return (
    <Link href={href} className="block" onClick={onClick}>
      <div className="flex items-center py-4 text-black hover:text-black/80 transition-colors">
        <span className="mr-3">{icon}</span>
        <span className="text-lg">{label}</span>
      </div>
      <Separator className="bg-gray-400" />
    </Link>
  )
}

export default function MobileMenuItems({ onItemClick }: MobileMenuItemsProps) {
  return (
    <div className="bg-[#F9F6F0] h-full overflow-y-hidden w-full px-6 absolute top-[65px] overflow-hidden z-40">
      <nav className="space-y-0">
        <MenuItem href="/agent" icon={<Bot size={20} />} label="Agent" onClick={onItemClick}/>
        <MenuItem href="/apikeys" icon={<Lock size={20}/>} label="Apikeys" onClick={onItemClick}/>
        <MenuItem href="/logs" icon={<Logs size={20} />} label="Logs" onClick={onItemClick}/>
        <MenuItem href="/query" icon={<UserRoundSearch size={20} />} label="Query" onClick={onItemClick}/>
        <MenuItem href="/settings" icon={<Settings2 size={20} />} label="Settings" onClick={onItemClick}/>
      </nav>

      <div className="mt-7">
      <UserProfile/>
      </div>
    </div>
  )
}
