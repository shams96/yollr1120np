"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal } from "lucide-react"

export function LeaderboardCard() {
    const leaders = [
        { rank: 1, name: "Sarah J.", xp: 2400, avatar: "" },
        { rank: 2, name: "Mike D.", xp: 2150, avatar: "" },
        { rank: 3, name: "Alex R.", xp: 1900, avatar: "" },
    ]

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
                    {leaders.map((leader) => (
                        <div key={leader.rank} className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
                            <div className="flex items-center space-x-3">
                                <div className="flex h-6 w-6 items-center justify-center font-black italic text-white/50">
                                    #{leader.rank}
                                </div>
                                <Avatar className="h-8 w-8 border border-white/10">
                                    <AvatarImage src={leader.avatar} />
                                    <AvatarFallback>{leader.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="font-bold text-sm text-white">{leader.name}</span>
                            </div>
                            <span className="text-xs font-mono text-yollr-lime">{leader.xp} XP</span>
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
