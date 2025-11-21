"use client"

import { useState, useEffect } from "react"
import { HeistCard } from "@/components/features/feed/heist-card"
import { PollCard } from "@/components/features/feed/poll-card"
import { MomentCard } from "@/components/features/feed/moment-card"
import { LeaderboardCard } from "@/components/features/feed/leaderboard-card"
import { MapCard } from "@/components/features/feed/map-card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export default function FeedPage() {
    const [feedItems, setFeedItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const items = []

                // 1. Fetch active heist
                const { data: heistData } = await supabase
                    .from('heists')
                    .select('*, sponsor:sponsors(*)')
                    .in('status', ['voting', 'active', 'submission'])
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single()

                if (heistData) {
                    items.push({ type: 'heist', data: heistData, id: `heist-${heistData.id}` })
                }

                // 2. Fetch active poll
                const { data: pollData } = await supabase
                    .from('polls')
                    .select('*, options:poll_options(*)')
                    .gt('expires_at', new Date().toISOString())
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single()

                if (pollData) {
                    // Insert poll after the first few moments
                    items.push({ type: 'poll', data: pollData, id: `poll-${pollData.id}` })
                }

                // 3. Fetch moments
                const { data: momentsData } = await supabase
                    .from('moments')
                    .select('*, user:users(username, avatar_url), campus:campuses(name)')
                    .order('created_at', { ascending: false })
                    .limit(20)

                if (momentsData) {
                    const formattedMoments = momentsData.map(m => ({ type: 'moment', data: m, id: m.id }))

                    // Interleave logic: Heist first, then moments, then poll
                    // For V1, let's just push moments. 
                    // In a real app, we'd splice them in.
                    // Current order in 'items' is Heist, Poll. 
                    // Let's make it: Heist -> Moment -> Moment -> Poll -> Rest of Moments

                    const finalFeed = []

                    // Add Heist if exists
                    if (heistData) finalFeed.push({ type: 'heist', data: heistData, id: `heist-${heistData.id}` })

                    // Add first 2 moments
                    finalFeed.push(...formattedMoments.slice(0, 2))

                    // Add Poll if exists
                    if (pollData) finalFeed.push({ type: 'poll', data: pollData, id: `poll-${pollData.id}` })

                    // Add rest of moments
                    finalFeed.push(...formattedMoments.slice(2))

                    setFeedItems(finalFeed)
                } else {
                    setFeedItems(items)
                }

            } catch (error) {
                console.error("Error fetching feed data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return <div className="flex h-screen w-full items-center justify-center bg-black text-white/50">Loading...</div>
    }

    return (
        <div className="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory no-scrollbar">
            {feedItems.map((item) => (
                <div key={item.id} className="h-screen w-full snap-start relative">
                    {item.type === 'heist' && <HeistCard heist={item.data} />}
                    {item.type === 'poll' && <PollCard poll={item.data} />}
                    {item.type === 'moment' && <MomentCard moment={item.data} />}
                </div>
            ))}

            {feedItems.length === 0 && (
                <div className="flex h-screen w-full items-center justify-center text-white/30">
                    <p>No content yet.</p>
                </div>
            )}

            {/* Bottom Nav Spacer is handled by the fixed nav, but we might need padding if nav is overlay */}
        </div>
    )
}
