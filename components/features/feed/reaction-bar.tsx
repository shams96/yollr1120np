"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ReactionBarProps {
    onReact: (type: string) => void
    counts?: { [key: string]: number }
    userReaction?: string | null
    vertical?: boolean
}

export function ReactionBar({ onReact, counts, userReaction, vertical = false }: ReactionBarProps) {
    const reactions = [
        { type: "fire", emoji: "🔥", label: "Fire" },
        { type: "funny", emoji: "😭", label: "Funny" },
        { type: "genius", emoji: "💡", label: "Genius" },
        { type: "star", emoji: "⭐", label: "Win" },
    ]

    return (
        <div className={cn(
            "flex items-center justify-between backdrop-blur-md rounded-full border border-white/5 transition-all",
            vertical
                ? "flex-col space-y-4 bg-transparent border-none w-auto p-0"
                : "w-full px-2 py-2 bg-black/20"
        )}>
            {reactions.map((r) => (
                <button
                    key={r.type}
                    onClick={() => onReact(r.type)}
                    className={cn(
                        "flex flex-col items-center justify-center rounded-full transition-all active:scale-90",
                        vertical ? "space-y-1" : "p-2",
                        userReaction === r.type ? "scale-110" : "hover:bg-white/10"
                    )}
                >
                    <div className={cn(
                        "flex items-center justify-center rounded-full bg-black/40 border border-white/10",
                        vertical ? "h-10 w-10" : "h-auto w-auto bg-transparent border-none"
                    )}>
                        <span className={cn(vertical ? "text-xl" : "text-2xl")}>{r.emoji}</span>
                    </div>

                    {counts && counts[r.type] > 0 && (
                        <span className="text-[10px] font-bold text-white shadow-black drop-shadow-md">
                            {counts[r.type]}
                        </span>
                    )}
                </button>
            ))}
        </div>
    )
}
