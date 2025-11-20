"use client"

import { useState, useEffect } from "react"

export function useYollrBell() {
    const [isActive, setIsActive] = useState(false)
    const [timeLeft, setTimeLeft] = useState<string | null>(null)

    useEffect(() => {
        // Mock logic: Check if Bell is active for the current campus
        // In production, this would query Supabase for the daily bell event
        const checkBellStatus = () => {
            // Mock: Bell is active between 11am and 7pm
            const now = new Date()
            const hour = now.getHours()
            const active = hour >= 11 && hour < 19

            setIsActive(active)
            if (active) {
                // Mock countdown
                setTimeLeft("01:59")
            } else {
                setTimeLeft(null)
            }
        }

        checkBellStatus()
        const interval = setInterval(checkBellStatus, 60000)
        return () => clearInterval(interval)
    }, [])

    return { isActive, timeLeft }
}
