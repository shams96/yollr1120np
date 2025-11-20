"use client"

import { Bell, Flame } from "lucide-react"

export function Header() {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-white/5 bg-midnight/80 px-4 backdrop-blur-lg">
            <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tighter text-white">
                    yollr
                </span>
                <div className="flex items-center rounded-full bg-white/5 px-2 py-0.5 text-xs font-medium text-yollr-lime border border-white/10">
                    <Flame className="mr-1 h-3 w-3 fill-current" />
                    12
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <button className="relative text-muted-foreground hover:text-foreground">
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-yollr-peach" />
                </button>
            </div>
        </div>
    )
}
