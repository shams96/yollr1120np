"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HeistSubmissionPage() {
    const router = useRouter()
    const [pitch, setPitch] = useState("")
    const [guardrails, setGuardrails] = useState({
        legal: false,
        campus: false,
        duration: false,
        crowd: false,
        sponsor: false
    })

    const allChecked = Object.values(guardrails).every(Boolean)

    const handleSubmit = () => {
        // Mock submission
        router.push("/feed")
    }

    return (
        <div className="min-h-screen bg-midnight p-4 pb-24">
            <div className="mb-6 flex items-center">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <h1 className="ml-2 text-xl font-black text-white">Submit Pitch</h1>
            </div>

            <div className="space-y-8">
                {/* Video Upload Placeholder */}
                <div className="aspect-[9/16] w-full rounded-2xl bg-white/5 border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-muted-foreground">
                    <Upload className="h-12 w-12 mb-4" />
                    <span className="text-sm">Upload 15s Pitch Video</span>
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-white">The Pitch</h3>
                    <Input
                        placeholder="Describe your heist in 50 words..."
                        value={pitch}
                        onChange={(e) => setPitch(e.target.value)}
                        className="bg-white/5 border-white/10"
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="font-bold text-white">Safety Guardrails</h3>
                    <div className="space-y-3">
                        {[
                            { id: "legal", label: "Legal & Safe" },
                            { id: "campus", label: "On-campus or <10 min walk" },
                            { id: "duration", label: "Under 2 hours total" },
                            { id: "crowd", label: "Max 200 participants" },
                            { id: "sponsor", label: "Tag sponsor in video" },
                        ].map((item) => (
                            <div key={item.id} className="flex items-center space-x-3">
                                <Checkbox
                                    id={item.id}
                                    checked={guardrails[item.id as keyof typeof guardrails]}
                                    onCheckedChange={(checked) =>
                                        setGuardrails(prev => ({ ...prev, [item.id]: checked === true }))
                                    }
                                />
                                <label htmlFor={item.id} className="text-sm text-white/80 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {item.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <Button
                    className="w-full h-14 text-lg font-bold bg-yollr-peach text-midnight"
                    disabled={!allChecked || !pitch}
                    onClick={handleSubmit}
                >
                    Submit Heist Plan
                </Button>
            </div>
        </div>
    )
}
