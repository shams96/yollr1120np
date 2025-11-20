"use client"

import { HeistCard } from "@/components/features/feed/heist-card"
import { PollCard } from "@/components/features/feed/poll-card"
import { MomentCard } from "@/components/features/feed/moment-card"
import { LeaderboardCard } from "@/components/features/feed/leaderboard-card"
import { MapCard } from "@/components/features/feed/map-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function FeedPage() {
    // Mock Data
    const activeHeist = {
        id: "h1",
        theme: "Library Silent Disco",
        description: "Turn the 3rd floor into a dance floor. Headphones only. 2PM Tuesday.",
        status: "voting"
    }

    const activePoll = {
        id: "p1",
        category: "Career",
        question: "Who should sponsor next week?",
        options: [
            { id: "o1", text: "Local Coffee Shop" },
            { id: "o2", text: "Campus Bookstore" }
        ]
    }

    const moments = [
        {
            id: "m1",
            user: { username: "jess_k", avatar_url: "" },
            caption: "Silent disco prep is crazy rn 🎧",
            thumbnail_url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80"
        },
        {
            id: "m2",
            user: { username: "mike_d", avatar_url: "" },
            caption: "Found the secret spot for the heist!",
            thumbnail_url: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=800&q=80"
        }
    ]

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
                <HeistCard heist={activeHeist} />

                {/* Feed Items */}
                <div className="space-y-6">
                    <LeaderboardCard />
                    <PollCard poll={activePoll} />
                    <MapCard />

                    {moments.map((moment) => (
                        <MomentCard key={moment.id} moment={moment} />
                    ))}
                </div>
            </div>

            {/* Floating Capture Button (Alternative to Bottom Nav for 'Time to Fun') */}
            <Link href="/capture">
                <div className="fixed bottom-24 right-4 z-50">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-yollr-peach to-yollr-pink flex items-center justify-center shadow-[0_0_30px_rgba(255,122,92,0.6)] animate-pulse-glow">
                        <Plus className="h-8 w-8 text-white" />
                    </div>
                </div>
            </Link>
        </div>
    )
}
