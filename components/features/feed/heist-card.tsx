"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Users, Clock, MapPin } from "lucide-react"
import { motion } from "framer-motion"

interface HeistCardProps {
    heist: any
}

export function HeistCard({ heist }: HeistCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
        >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yollr-peach to-yollr-pink p-[1px]">
                <div className="relative h-full rounded-[23px] bg-midnight/95 backdrop-blur-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/5">
                        <div className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yollr-lime/20 text-yollr-lime">
                                <Trophy className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-bold tracking-wider text-yollr-lime uppercase">
                                Active Heist
                            </span>
                        </div>
                        <span className="text-xs font-medium text-white/60">Ends Sun 23:59</span>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        <h2 className="text-2xl font-black text-white leading-none">
                            {heist.theme}
                        </h2>
                        <p className="text-sm text-white/70 line-clamp-2">
                            {heist.description}
                        </p>

                        {/* Sponsor */}
                        <div className="flex items-center p-3 rounded-xl bg-white/5 border border-white/5">
                            <div className="h-8 w-8 rounded-full bg-white/10 mr-3" />
                            <div>
                                <p className="text-xs text-white/50">Sponsored by</p>
                                <p className="text-sm font-bold text-white">Joe's Pizza</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-black/20 flex items-center justify-between">
                        <div className="flex space-x-4 text-xs font-medium text-white/60">
                            <span className="flex items-center"><Users className="h-3 w-3 mr-1" /> 1.2k</span>
                            <span className="flex items-center"><MapPin className="h-3 w-3 mr-1" /> Campus</span>
                        </div>
                        <Button size="sm" className="bg-yollr-peach text-midnight hover:bg-yollr-peach/90 font-bold">
                            Join Heist
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
