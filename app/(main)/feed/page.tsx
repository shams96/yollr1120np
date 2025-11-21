"use client"

import { HeistCard } from "@/components/features/feed/heist-card"
import { PollCard } from "@/components/features/feed/poll-card"
import { MomentCard } from "@/components/features/feed/moment-card"
import { LeaderboardCard } from "@/components/features/feed/leaderboard-card"
```javascript
import { useState, useEffect } from "react"
import { HeistCard } from "@/components/features/feed/heist-card"
import { PollCard } from "@/components/features/feed/poll-card"
import { MomentCard } from "@/components/features/feed/moment-card"
import { LeaderboardCard } from "@/components/features/feed/leaderboard-card"
import { MapCard } from "@/components/features/feed/map-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

export default function FeedPage() {
    const [activeHeist, setActiveHeist] = useState<any>(null)
    const [activePoll, setActivePoll] = useState<any>(null)
    const [moments, setMoments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch active heist (prioritize 'voting' or 'active' status)
                const { data: heistData } = await supabase
                    .from('heists')
                    .select('*, sponsor:sponsors(*)')
                    .in('status', ['voting', 'active', 'submission'])
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single()
                
                if (heistData) setActiveHeist(heistData)

                // Fetch latest active poll
                const { data: pollData } = await supabase
                    .from('polls')
                    .select('*, options:poll_options(*)')
                    .gt('expires_at', new Date().toISOString())
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single()
                
                if (pollData) setActivePoll(pollData)

                // Fetch moments
                const { data: momentsData } = await supabase
                    .from('moments')
                    .select('*, user:users(username, avatar_url)')
                    .order('created_at', { ascending: false })
                    .limit(20)
                
                if (momentsData) setMoments(momentsData)

            } catch (error) {
                console.error("Error fetching feed data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center text-white/50">Loading feed...</div>
    }

    return (
        <div className="pb-24">
            {/* Deferred Profile Nudge */}
            <div className="px-4 py-2 mb-2">
                <div className="flex items-center justify-between bg-yollr-lime/10 rounded-full px-4 py-2 border border-yollr-lime/20">
                    <span className="text-xs font-bold text-yollr-lime">Complete your profile to join rankings</span>
                    <Button size="sm" variant="ghost" className="h-6 text-[10px] text-yollr-lime hover:text-white">
                        Add Class Year
                    </Button>
                </div>
            </div>

            <div className="px-4">
                {/* Pinned Heist */}
                {activeHeist && <HeistCard heist={activeHeist} />}

                {/* Feed Items */}
                <div className="space-y-6 mt-6">
                    <LeaderboardCard />
                    {activePoll && <PollCard poll={activePoll} />}
                    <MapCard />

                    {moments.map((moment) => (
                        <MomentCard key={moment.id} moment={moment} />
                    ))}
                    
                    {moments.length === 0 && (
                        <div className="text-center text-white/30 py-10">
                            <p>No moments yet. Be the first!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
```
