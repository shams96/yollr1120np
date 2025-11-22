"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, Share2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser()
            if (authUser) {
                const { data, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', authUser.id)
                    .single()

                if (!error && data) {
                    setUser(data)
                }
            }
            setLoading(false)
        }
        fetchUser()
    }, [])

    if (loading) {
        return <div className="p-8 text-center text-white animate-pulse">Loading profile...</div>
    }

    if (!user) {
        return <div className="p-8 text-center text-white">Please log in</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4 pt-4">
                <Avatar className="h-24 w-24 border-4 border-yollr-peach">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="text-2xl">{user.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white">{user.username || 'Anonymous'}</h1>
                    <p className="text-yollr-cyan font-medium">Class of {user.class_year || '202?'}</p>
                </div>

                <div className="flex space-x-4">
                    <div className="text-center">
                        <div className="text-xl font-bold text-white">{user.current_streak || 0}</div>
                        <div className="text-xs text-muted-foreground">Streak</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold text-white">{user.xp_total || 0}</div>
                        <div className="text-xs text-muted-foreground">XP</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold text-white">0</div>
                        <div className="text-xs text-muted-foreground">Wins</div>
                    </div>
                </div>
            </div>

            <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-white">Heist Pass</span>
                        <span className="text-yollr-lime text-sm font-bold">Level {Math.floor((user.heist_pass_xp || 0) / 1000) + 1}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-yollr-lime to-green-400"
                            style={{ width: `${((user.heist_pass_xp || 0) % 1000) / 10}%` }}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                </Button>
                <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                </Button>
            </div>
        </div>
    )
}
