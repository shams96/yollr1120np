"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PollCardProps {
    poll: any
}

export function PollCard({ poll }: PollCardProps) {
    const [votedOption, setVotedOption] = useState<string | null>(null)

    return (
        <div className="h-full w-full relative bg-midnight overflow-hidden flex flex-col items-center justify-center p-6">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-yollr-cyan/20 to-midnight z-0" />

            <div className="relative z-10 w-full max-w-md space-y-8 text-center">
                {/* Header */}
                <div className="space-y-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-yollr-cyan/20 text-yollr-cyan text-xs font-bold uppercase tracking-widest border border-yollr-cyan/30">
                        {poll.category} Poll
                    </span>
                    <h2 className="text-3xl font-black text-white leading-tight drop-shadow-xl">
                        {poll.question}
                    </h2>
                    <p className="text-white/60 text-sm">1.5k votes • Ends in 2h</p>
                </div>

                {/* Options */}
                <div className="space-y-4">
                    {poll.options.map((opt: any) => {
                        const isSelected = votedOption === opt.id
                        const percent = 45 // Mock percentage

                        return (
                            <div key={opt.id} className="relative group">
                                {/* Progress Bar Background */}
                                {votedOption && (
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percent}%` }}
                                        className="absolute inset-0 bg-yollr-cyan/20 rounded-2xl z-0"
                                    />
                                )}

                                <button
                                    onClick={() => setVotedOption(opt.id)}
                                    className={cn(
                                        "relative z-10 w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all duration-200",
                                        isSelected
                                            ? "border-yollr-cyan bg-yollr-cyan/10"
                                            : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                                    )}
                                >
                                    <span className={cn("text-lg font-bold", isSelected ? "text-yollr-cyan" : "text-white")}>
                                        {opt.text}
                                    </span>
                                    {votedOption && (
                                        <span className="text-xl font-black text-yollr-cyan">{percent}%</span>
                                    )}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
