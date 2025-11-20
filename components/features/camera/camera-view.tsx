"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw, Zap, Video } from "lucide-react"
import { useRouter } from "next/navigation"

export function CameraView() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [isRecording, setIsRecording] = useState(false)
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
    const [hasMultipleCameras, setHasMultipleCameras] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    // Check for multiple cameras
    useEffect(() => {
        async function checkDevices() {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices()
                const videoDevices = devices.filter(device => device.kind === 'videoinput')
                setHasMultipleCameras(videoDevices.length > 1)
            } catch (err) {
                console.error("Error checking devices:", err)
            }
        }
        checkDevices()
    }, [])

    const startCamera = useCallback(async () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
        }

        try {
            const constraints = {
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1920 }, // Request high resolution
                    height: { ideal: 1080 },
                    aspectRatio: { ideal: 9 / 16 } // Portrait preference
                },
                audio: true
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
            setError(null)
        } catch (err: any) {
            console.error("Error accessing camera:", err)
            setError("Could not access camera. Please check permissions.")
        }
    }, [facingMode])

    useEffect(() => {
        startCamera()
        return () => {
            stream?.getTracks().forEach(track => track.stop())
        }
    }, [startCamera])

    const toggleCamera = () => {
        setFacingMode(prev => prev === "user" ? "environment" : "user")
    }

    const toggleRecording = () => {
        setIsRecording(!isRecording)
        // Mock recording logic for V1
        if (!isRecording) {
            setTimeout(() => {
                setIsRecording(false)
                router.push("/feed") // Mock success redirect
            }, 3000)
        }
    }

    return (
        <div className="relative h-screen w-full bg-black overflow-hidden">
            {error ? (
                <div className="flex h-full items-center justify-center text-white p-6 text-center">
                    <div>
                        <Video className="h-12 w-12 mx-auto mb-4 text-red-500" />
                        <p>{error}</p>
                        <Button onClick={startCamera} className="mt-4" variant="outline">Retry</Button>
                    </div>
                </div>
            ) : (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`h-full w-full object-cover transition-transform duration-500 ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                />
            )}

            {/* Top Controls */}
            <div className="absolute top-0 left-0 right-0 p-4 pt-safe flex justify-between items-center z-10 bg-gradient-to-b from-black/40 to-transparent">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon" className="bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40">
                    <Zap className="h-6 w-6" />
                </Button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 flex justify-around items-center bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <Button variant="ghost" size="icon" className="opacity-0">
                    {/* Spacer */}
                    <div className="h-10 w-10" />
                </Button>

                <button
                    onClick={toggleRecording}
                    className={`h-20 w-20 rounded-full border-[6px] border-white flex items-center justify-center transition-all duration-200 ${isRecording ? "bg-red-500 scale-110 border-red-200" : "bg-transparent hover:scale-105"
                        }`}
                >
                    {isRecording && <div className="h-8 w-8 bg-white rounded-sm" />}
                </button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleCamera}
                    disabled={!hasMultipleCameras}
                    className={`bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-opacity ${!hasMultipleCameras ? 'opacity-50' : ''}`}
                >
                    <RefreshCw className="h-6 w-6" />
                </Button>
            </div>
        </div>
    )
}
