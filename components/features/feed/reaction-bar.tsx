"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ReactionBarProps {
    onReact: (type: string) => void
    counts?: { [key: string]: number }
    userReaction?: string | null
}

export function ReactionBar({ onReact, counts, userReaction }: ReactionBarProps) {
    const reactions = [
        { type: "fire", emoji: "🔥", label: "Fire" },
        { type: "funny", emoji: "😭", label: "Funny" },
        { type: "genius", emoji: "💡", label: "Genius" },
        { type: "star", emoji: "⭐", label: "Win" },
    ]

    return (
        <div className="flex items-center justify-between w-full px-2 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/5">
            {reactions.map((r) => (
                <button
                    key={r.type}
                    onClick={() => onReact(r.type)}
                    className={cn(
                        "flex flex-col items-center justify-center p-2 rounded-full transition-all active:scale-90",
                        userReaction === r.type ? "bg-white/20 scale-110" : "hover:bg-white/10"
                    )}
                >
                    <span className="text-2xl">{r.emoji}</span>
                    {counts && counts[r.type] > 0 && (
                        <span className="text-[10px] font-bold text-white/80">
                            {counts[r.type]}
                        </span>
                    )}
                </button>
            ))}
        </div>
    )
}
