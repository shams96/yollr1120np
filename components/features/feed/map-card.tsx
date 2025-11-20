"use client"

import { Card } from "@/components/ui/card"
import { MapPin, Zap } from "lucide-react"

export function MapCard() {
    return (
        <Card className="mb-6 overflow-hidden border-white/10 bg-card">
            <div className="relative h-48 w-full bg-gray-900">
                {/* Mock Map Background */}
                <div className="absolute inset-0 opacity-50"
                    style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                {/* Heatmap Pulses */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="h-24 w-24 rounded-full bg-yollr-peach/20 animate-pulse-glow blur-xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-yollr-peach shadow-[0_0_20px_var(--electric-peach)]" />
                </div>

                <div className="absolute top-1/3 left-1/3">
                    <div className="h-2 w-2 rounded-full bg-yollr-cyan shadow-[0_0_10px_var(--cyan-pop)]" />
                </div>

                {/* Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-yollr-peach" />
                            <span className="text-sm font-bold text-white">Campus Heatmap</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-yollr-cyan">
                            <Zap className="h-3 w-3" />
                            <span>Live Activity</span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
