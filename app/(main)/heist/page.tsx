"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Clock, Video, ThumbsUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function HeistPage() {
    const [heist, setHeist] = useState<any>(null)
    const [submissions, setSubmissions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get Active Heist
                const { data: heistData, error: heistError } = await supabase
                    .from('heists')
                    .select('*')
                    .eq('status', 'submission') // Or 'voting'
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single()

                if (heistError) throw heistError
                setHeist(heistData)

                if (heistData) {
                    // 2. Get Submissions
                    const { data: subData, error: subError } = await supabase
                        .from('heist_submissions')
                        .select('*, users(username, avatar_url)')
                        .eq('heist_id', heistData.id)
                        .order('vote_count', { ascending: false })

                    if (subError) throw subError
                    setSubmissions(subData || [])
                }
            } catch (error) {
                console.error("Error fetching heist:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return <div className="p-8 text-center text-white animate-pulse">Loading heist details...</div>
    }

    if (!heist) {
        return (
            <div className="p-8 text-center space-y-4">
                <h1 className="text-2xl font-bold text-white">No Active Heist</h1>
                <p className="text-muted-foreground">Check back next week!</p>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-24">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black text-white">{heist.theme}</h1>
                <p className="text-yollr-peach font-medium">Week {heist.week_number} • {heist.status.toUpperCase()}</p>
                <p className="text-sm text-white/70 px-4">{heist.description}</p>
            </div>

            <Card className="border-yollr-peach/30 bg-gradient-to-b from-yollr-peach/10 to-transparent mx-4">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Trophy className="h-6 w-6 text-yollr-peach" />
                        <span className="text-white">Prize Pool</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-black text-white">$500</div>
                    <p className="text-sm text-muted-foreground">Sponsored by Joe's Pizza</p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4 mx-4">
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <Users className="h-8 w-8 mb-2 text-yollr-cyan" />
                        <span className="text-2xl font-bold text-white">{submissions.length}</span>
                        <span className="text-xs text-muted-foreground">Entries</span>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <Clock className="h-8 w-8 mb-2 text-yollr-pink" />
                        <span className="text-2xl font-bold text-white">48h</span>
                        <span className="text-xs text-muted-foreground">Time Left</span>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4 px-4">
                <h3 className="text-xl font-bold text-white">Top Submissions</h3>

                {submissions.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
                        No submissions yet. Be the first!
                    </div>
                ) : (
                    <div className="space-y-4">
                        {submissions.map((sub) => (
                            <div key={sub.id} className="relative aspect-video rounded-xl overflow-hidden bg-black group">
                                <img src={sub.thumbnail_url || "/placeholder.jpg"} alt="Submission" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Video className="h-12 w-12 text-white opacity-80" />
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent flex justify-between items-end">
                                    <div>
                                        <p className="text-white font-bold text-sm">@{sub.users?.username || 'User'}</p>
                                        <p className="text-white/70 text-xs line-clamp-1">{sub.pitch_text}</p>
                                    </div>
                                    <div className="flex items-center space-x-1 text-yollr-lime">
                                        <ThumbsUp className="h-4 w-4" />
                                        <span className="text-xs font-bold">{sub.vote_count}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="fixed bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-midnight via-midnight/90 to-transparent">
                <Button
                    className="w-full h-14 text-lg font-bold bg-yollr-peach hover:bg-yollr-peach/90 text-midnight shadow-[0_0_20px_rgba(255,122,92,0.3)]"
                    onClick={() => router.push('/capture')}
                >
                    Submit Pitch
                </Button>
            </div>
        </div>
    )
}
