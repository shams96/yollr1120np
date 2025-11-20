"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
    const [phone, setPhone] = useState("")
    const [otp, setOtp] = useState("")
    const [step, setStep] = useState<"phone" | "otp">("phone")
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSendCode = async () => {
        setLoading(true)
        // In real app: await supabase.auth.signInWithOtp({ phone })
        // For demo: just switch step
        setTimeout(() => {
            setStep("otp")
            setLoading(false)
        }, 1000)
    }

    const handleVerify = async () => {
        setLoading(true)
        // In real app: await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' })
        // For demo: redirect to onboarding
        setTimeout(() => {
            router.push("/campus")
        }, 1000)
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-midnight p-6 text-center">
            <div className="mb-12 space-y-2">
                <h1 className="text-5xl font-black tracking-tighter text-white">yollr</h1>
                <p className="text-lg text-muted-foreground">Campus Heists & Moments</p>
            </div>

            <div className="w-full max-w-sm space-y-6">
                {step === "phone" ? (
                    <div className="space-y-4">
                        <Input
                            type="tel"
                            placeholder="(555) 555-5555"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="text-center text-xl h-14 bg-white/5 border-white/10 text-white placeholder:text-white/20"
                        />
                        <Button
                            className="w-full h-14 text-lg font-bold bg-yollr-peach hover:bg-yollr-peach/90 text-midnight"
                            onClick={handleSendCode}
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Get Code"}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Input
                            type="text"
                            placeholder="123456"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="text-center text-2xl tracking-[0.5em] h-14 bg-white/5 border-white/10 text-white"
                            maxLength={6}
                        />
                        <Button
                            className="w-full h-14 text-lg font-bold bg-yollr-peach hover:bg-yollr-peach/90 text-midnight"
                            onClick={handleVerify}
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Enter Campus"}
                        </Button>
                        <button
                            onClick={() => setStep("phone")}
                            className="text-sm text-muted-foreground underline"
                        >
                            Wrong number?
                        </button>
                    </div>
                )}
            </div>

            <p className="mt-8 text-xs text-white/30 max-w-xs">
                By entering, you agree to our Terms.
                <br />
                Standard rates apply.
            </p>
        </div>
    )
}
