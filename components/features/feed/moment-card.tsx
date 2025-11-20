"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ReactionBar } from "./reaction-bar"
import { cn } from "@/lib/utils"

interface MomentCardProps {
    moment: any
}

export function MomentCard({ moment }: MomentCardProps) {
    return (
        <div className="relative mb-6 w-full aspect-[9/16] rounded-3xl overflow-hidden bg-black shadow-2xl">
            {/* Video Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />
            <img
                src={moment.thumbnail_url || "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80"}
                alt="Moment"
                className="absolute inset-0 h-full w-full object-cover opacity-80"
            />

            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 flex flex-col justify-between p-4">
                {/* Header */}
                <div className="flex items-center space-x-2 pt-2">
                    <Avatar className="h-8 w-8 border border-white/20">
                        <AvatarImage src={moment.user.avatar_url} />
                        <AvatarFallback>UN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-white shadow-black drop-shadow-md">
                            {moment.user.username}
                        </span>
                        <span className="text-[10px] text-white/80">2h ago • {moment.campus?.name || "Campus"}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="space-y-4 pb-2">
                    <p className="text-white text-sm font-medium drop-shadow-md line-clamp-2">
                        {moment.caption}
                    </p>

                    <ReactionBar
                        onReact={(type) => console.log(type)}
                        counts={{ fire: 12, funny: 4, genius: 0, star: 1 }}
                    />
                </div>
            </div>
        </div>
    )
}
