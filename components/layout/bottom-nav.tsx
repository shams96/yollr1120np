"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Map, PlusSquare, Trophy, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNav() {
    const pathname = usePathname()

    const items = [
        { href: "/feed", icon: Home, label: "Feed" },
        { href: "/map", icon: Map, label: "Map" },
        { href: "/capture", icon: PlusSquare, label: "Capture", isPrimary: true },
        { href: "/heist", icon: Trophy, label: "Heist" },
        { href: "/profile", icon: User, label: "Profile" },
    ]

    if (pathname === "/login" || pathname === "/") return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-midnight/80 backdrop-blur-lg pb-safe">
            <div className="flex h-16 items-center justify-around px-2">
                {items.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    if (item.isPrimary) {
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex -mt-8 h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-yollr-peach to-yollr-pink shadow-[0_0_20px_rgba(255,122,92,0.5)] transition-transform active:scale-95"
                            >
                                <Icon className="h-8 w-8 text-white" />
                            </Link>
                        )
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center space-y-1 p-2 transition-colors",
                                isActive ? "text-yollr-peach" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className="h-6 w-6" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
