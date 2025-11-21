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
        <div className="h-full w-full relative bg-midnight overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yollr-peach via-yollr-pink to-midnight opacity-20 animate-pulse" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1561489396-888724a1543d?w=800&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay" />

            <div className="relative h-full flex flex-col items-center justify-center p-8 text-center space-y-8">
                {/* Top Badge */}
                <div className="absolute top-12 left-0 right-0 flex justify-center">
                    <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                        <Trophy className="h-4 w-4 text-yollr-lime" />
                        <span className="text-xs font-bold tracking-widest text-white uppercase">Active Heist</span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-4 max-w-md">
                    <h1 className="text-5xl font-black text-white leading-tight tracking-tighter drop-shadow-2xl">
                        {heist.theme}
                    </h1>
                    <p className="text-xl text-white/80 font-medium leading-relaxed">
                        {heist.description}
                    </p>
                </div>

                {/* Sponsor */}
                <div className="flex flex-col items-center space-y-2">
                    <span className="text-xs text-white/40 uppercase tracking-widest">Sponsored By</span>
                    <div className="flex items-center space-x-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-orange-500 to-yellow-500" />
                        <span className="text-lg font-bold text-white">Joe's Pizza</span>
                    </div>
                </div>

                {/* CTA */}
                <div className="absolute bottom-24 left-0 right-0 px-8">
                    <Button className="w-full h-16 text-xl font-black bg-yollr-lime text-midnight hover:bg-yollr-lime/90 rounded-2xl shadow-[0_0_40px_rgba(200,255,61,0.3)] transition-transform hover:scale-105 active:scale-95">
                        JOIN THE HEIST
                    </Button>
                    <p className="mt-4 text-sm text-white/40 flex items-center justify-center">
                        <Clock className="h-4 w-4 mr-2" /> Ends Sunday at Midnight
                    </p>
                </div>
            </div>
        </div>
    )
}
