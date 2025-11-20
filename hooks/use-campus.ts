"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function useCampus() {
    const [campus, setCampus] = useState<any | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchCampus() {
            try {
                // 1. Check local storage or user profile
                const { data: { user } } = await supabase.auth.getUser()

                if (user) {
                    const { data: profile } = await supabase
                        .from("users")
                        .select("campus_id, campuses(*)")
                        .eq("id", user.id)
                        .single()

                    if (profile?.campuses) {
                        setCampus(profile.campuses)
                    }
                }
            } catch (error) {
                console.error("Error fetching campus:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCampus()
    }, [])

    return { campus, loading }
}
