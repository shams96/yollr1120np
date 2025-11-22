"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function LeaderboardCard() {
    const [leaders, setLeaders] = useState<any[]>([])
    const supabase = createClient()

    useEffect(() => {
        const fetchLeaders = async () => {
            const { data } = await supabase
                .from('users')
                .select('username, xp_total, avatar_url')
                .order('xp_total', { ascending: false })
                .limit(3)

            if (data) {
                setLeaders(data)
            }
        }
        fetchLeaders()
    }, [])

    if (leaders.length === 0) return null

    return (
        <Card className="mb-6 border-yollr-lime/20 bg-gradient-to-br from-card to-yollr-lime/5">
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Trophy className="h-4 w-4 text-yollr-lime" />
                        <span className="text-xs font-bold text-yollr-lime uppercase tracking-wider">
                            Weekly Top 3
                        </span>
                    </div>
                    <span className="text-xs text-muted-foreground">Resets Mon 9AM</span>
                </div>

                <div className="space-y-3">
                    {leaders.map((leader, index) => (
                        <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-6 w-6 items-center justify-center font-black italic text-white/50">
                                    #{index + 1}
                                </div>
                                <Avatar className="h-8 w-8 border border-white/10">
                                    <AvatarImage src={leader.avatar_url} />
                                    <AvatarFallback>{leader.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                                </Avatar>
                                <span className="font-bold text-sm text-white">{leader.username || 'Anonymous'}</span>
                            </div>
                            <span className="text-xs font-mono text-yollr-lime">{leader.xp_total || 0} XP</span>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <button className="text-xs text-muted-foreground hover:text-white transition-colors">
                        View Full Leaderboard
                    </button>
                </div>
            </div>
        </Card>
    )
}
