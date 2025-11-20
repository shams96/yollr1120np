"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, Flame, Trophy } from "lucide-react"
import { motion } from "framer-motion"

interface FeedItemProps {
    type: "moment" | "heist" | "poll"
    data: any
}

export function FeedItem({ type, data }: FeedItemProps) {
    if (type === "poll") {
        return (
            <Card className="mb-4 border-yollr-peach/20 bg-gradient-to-br from-card to-yollr-peach/5">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-yollr-peach uppercase tracking-wider">
                            Daily Poll • {data.category}
                        </span>
                        <span className="text-xs text-muted-foreground">Ends in 2h</span>
                    </div>
                    <h3 className="text-lg font-bold leading-tight">{data.question}</h3>
                </CardHeader>
                <CardContent className="space-y-2">
                    {data.options.map((opt: any) => (
                        <Button
                            key={opt.id}
                            variant="outline"
                            className="w-full justify-start h-auto py-3 text-left font-normal hover:border-yollr-peach hover:bg-yollr-peach/10"
                        >
                            {opt.text}
                        </Button>
                    ))}
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                    {data.vote_count} votes • Campus wide
                </CardFooter>
            </Card>
        )
    }

    if (type === "heist") {
        return (
            <Card className="mb-4 overflow-hidden border-yollr-pink/20">
                <div className="relative aspect-video bg-black">
                    {/* Placeholder for video player */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Trophy className="h-12 w-12 text-yollr-pink opacity-50" />
                    </div>
                    <div className="absolute top-2 left-2 bg-yollr-pink text-white text-xs font-bold px-2 py-1 rounded">
                        HEIST PITCH
                    </div>
                </div>
                <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={data.user.avatar_url} />
                            <AvatarFallback>UN</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-bold">{data.user.username}</p>
                            <p className="text-xs text-muted-foreground">Class of {data.user.class_year}</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="pb-2">
                    <p className="text-sm">{data.pitch_text}</p>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                    <Button variant="ghost" size="sm" className="space-x-1">
                        <Flame className="h-4 w-4" />
                        <span>{data.vote_count}</span>
                    </Button>
                    <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    // Default to Moment
    return (
        <Card className="mb-4 overflow-hidden border-0 bg-transparent">
            <div className="relative aspect-[9/16] rounded-2xl bg-black overflow-hidden">
                {/* Placeholder for video */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center space-x-2 mb-2">
                        <Avatar className="h-8 w-8 border-2 border-white">
                            <AvatarImage src={data.user.avatar_url} />
                            <AvatarFallback>UN</AvatarFallback>
                        </Avatar>
                        <span className="text-white font-bold text-sm shadow-black drop-shadow-md">
                            {data.user.username}
                        </span>
                    </div>
                    <p className="text-white text-sm mb-4 drop-shadow-md">{data.caption}</p>

                    {/* Reactions Bar */}
                    <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                            <button className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors">
                                <span className="text-xl">🔥</span>
                            </button>
                            <button className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors">
                                <span className="text-xl">😭</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
