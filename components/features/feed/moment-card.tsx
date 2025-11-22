"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ReactionBar } from "./reaction-bar"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface MomentCardProps {
    moment: any
}

export function MomentCard({ moment }: MomentCardProps) {
    const [counts, setCounts] = useState(moment.reactions || { fire: 0, funny: 0, genius: 0, star: 0 })
    const [userReaction, setUserReaction] = useState<string | null>(null)
    const supabase = createClient()

    const handleReaction = async (type: string) => {
        // Optimistic update
        const isRemoving = userReaction === type
        const newReaction = isRemoving ? null : type

        setCounts((prev: any) => ({
            ...prev,
            [type]: isRemoving ? Math.max(0, prev[type] - 1) : prev[type] + 1,
            ...(userReaction && userReaction !== type ? { [userReaction]: Math.max(0, prev[userReaction] - 1) } : {})
        }))
        setUserReaction(newReaction)

        // DB Update
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        if (isRemoving) {
            await supabase.from('reactions')
                .delete()
                .match({ user_id: user.id, moment_id: moment.id })
        } else {
            // Delete any existing reaction first (enforce one reaction per user per moment)
            if (userReaction) {
                await supabase.from('reactions')
                    .delete()
                    .match({ user_id: user.id, moment_id: moment.id })
            }

            await supabase.from('reactions').insert({
                user_id: user.id,
                moment_id: moment.id,
                type: type,
                campus_id: moment.campus_id
            })
        }
    }

    return (
        <div className="relative h-full w-full bg-black">
            {/* Video/Image Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 z-10" />
            <img
                src={moment.thumbnail_url || "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80"}
                alt="Moment"
                className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Right Side Actions */}
            <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center space-y-6">
                <div className="flex flex-col items-center space-y-1">
                    <Avatar className="h-12 w-12 border-2 border-white">
                        <AvatarImage src={moment.user?.avatar_url} />
                        <AvatarFallback>{moment.user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                </div>

                <ReactionBar
                    onReact={handleReaction}
                    counts={counts}
                    userReaction={userReaction}
                    vertical
                />
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pb-24 z-20 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex flex-col items-start space-y-2 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-white drop-shadow-md">
                            @{moment.user?.username || 'Anonymous'}
                        </span>
                        <span className="text-xs text-white/70">• 2h ago</span>
                    </div>
                    <p className="text-white text-base font-medium drop-shadow-md line-clamp-3">
                        {moment.caption}
                    </p>
                    {moment.campus && (
                        <div className="flex items-center text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
                            <span className="mr-1">📍</span> {moment.campus.name}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
