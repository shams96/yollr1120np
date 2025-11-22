"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PollCardProps {
    poll: any
}

export function PollCard({ poll }: PollCardProps) {
    const { toast } = useToast()
    const [votedOption, setVotedOption] = useState<string | null>(null)
    const [options, setOptions] = useState(poll.options)

    const totalVotes = options.reduce((acc: number, opt: any) => acc + (opt.vote_count || 0), 0)

    const handleVote = (optionId: string) => {
        if (votedOption) return // Prevent double voting in this session

        setVotedOption(optionId)

        // Optimistically update UI
        setOptions(options.map((opt: any) => {
            if (opt.id === optionId) {
                return { ...opt, vote_count: (opt.vote_count || 0) + 1 }
            }
            return opt
        }))

        toast({
            title: "Vote Cast! 🗳️",
            description: "+10 XP",
            className: "bg-yollr-lime text-midnight border-none font-bold"
        })

        // In a real app, we'd call Supabase here:
        // await supabase.from('poll_votes').insert(...)
        // await supabase.rpc('increment_poll_vote', { option_id: optionId })
    }

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
                    <p className="text-white/60 text-sm">{totalVotes} votes • Ends in 2h</p>
                </div>

                {/* Options */}
                <div className="space-y-4">
                    {options.map((opt: any) => {
                        const isSelected = votedOption === opt.id
                        const votes = opt.vote_count || 0
                        // Calculate percentage, default to 0 if no votes
                        const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0

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
                                    onClick={() => handleVote(opt.id)}
                                    disabled={!!votedOption}
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
