"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ReactionBar } from "./reaction-bar"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { MessageCircle, Send } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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

    const [isCommentsOpen, setIsCommentsOpen] = useState(false)
    const [commentText, setCommentText] = useState("")
    const [comments, setComments] = useState<any[]>([])

    const handlePostComment = async () => {
        if (!commentText.trim()) return

        // Optimistic update
        const newComment = {
            id: Math.random().toString(),
            text: commentText,
            user: { username: 'You', avatar_url: '' },
            created_at: new Date().toISOString()
        }
        setComments([newComment, ...comments])
        setCommentText("")

        // DB Update (Mock for now, would be 'comments' table)
        /*
        await supabase.from('comments').insert({
            moment_id: moment.id,
            text: commentText,
            user_id: user.id
        })
        */
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

                <Sheet open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
                    <SheetTrigger asChild>
                        <button className="flex flex-col items-center space-y-1 group">
                            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-black/40 border border-white/10 group-hover:bg-white/10 transition-colors">
                                <MessageCircle className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-[10px] font-bold text-white shadow-black drop-shadow-md">
                                {comments.length}
                            </span>
                        </button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[70vh] bg-midnight border-t-white/10 rounded-t-3xl">
                        <SheetHeader className="mb-4">
                            <SheetTitle className="text-white">Comments</SheetTitle>
                        </SheetHeader>

                        <div className="flex flex-col h-full pb-12">
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                {comments.length === 0 ? (
                                    <div className="text-center text-white/40 py-8">No comments yet. Be the first!</div>
                                ) : (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="flex space-x-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={comment.user.avatar_url} />
                                                <AvatarFallback>{comment.user.username[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-baseline space-x-2">
                                                    <span className="text-sm font-bold text-white">{comment.user.username}</span>
                                                    <span className="text-xs text-white/40">just now</span>
                                                </div>
                                                <p className="text-sm text-white/80">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="mt-4 flex items-center space-x-2">
                                <Input
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="bg-white/5 border-white/10 text-white"
                                    onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                                />
                                <Button size="icon" onClick={handlePostComment} className="bg-yollr-cyan text-midnight hover:bg-yollr-cyan/80">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
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
