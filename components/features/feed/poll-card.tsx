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
        <Card className="mb-6 border-yollr-cyan/20 bg-gradient-to-br from-card to-yollr-cyan/5 overflow-hidden">
            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-yollr-cyan uppercase tracking-wider">
                        {poll.category} Poll
                    </span>
                    <span className="text-xs text-muted-foreground">1.5k votes</span>
                </div>

                <h3 className="text-lg font-bold text-white leading-tight">
                    {poll.question}
                </h3>

                <div className="space-y-2">
                    {poll.options.map((opt: any) => {
                        const isSelected = votedOption === opt.id
                        const percent = 45 // Mock percentage

                        return (
                            <div key={opt.id} className="relative">
                                {/* Progress Bar Background */}
                                {votedOption && (
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percent}%` }}
                                        className="absolute inset-0 bg-yollr-cyan/10 rounded-xl z-0"
                                    />
                                )}

                                <Button
                                    variant="outline"
                                    onClick={() => setVotedOption(opt.id)}
                                    className={cn(
                                        "relative z-10 w-full justify-between h-auto py-3 px-4 font-normal border-white/10 hover:bg-white/5 hover:text-white",
                                        isSelected && "border-yollr-cyan text-yollr-cyan bg-yollr-cyan/5"
                                    )}
                                >
                                    <span>{opt.text}</span>
                                    {votedOption && <span className="font-bold">{percent}%</span>}
                                </Button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Card>
    )
}
