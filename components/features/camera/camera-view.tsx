"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw, Zap, Video } from "lucide-react"
import { useRouter } from "next/navigation"

export function CameraView() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const previewRef = useRef<HTMLVideoElement>(null)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [isRecording, setIsRecording] = useState(false)
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment")
    const [hasMultipleCameras, setHasMultipleCameras] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [recordedUrl, setRecordedUrl] = useState<string | null>(null)
    const [recordingTime, setRecordingTime] = useState(0)
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const router = useRouter()

    const [zoom, setZoom] = useState(1)
    const [zoomCap, setZoomCap] = useState<{ min: number, max: number, step: number } | null>(null)

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
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    aspectRatio: { ideal: 9 / 16 },
                    zoom: true // Request zoom capability
                },
                audio: true
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
            setError(null)

            // Check zoom capabilities
            const videoTrack = mediaStream.getVideoTracks()[0]
            const capabilities = videoTrack.getCapabilities() as any // Type cast for non-standard zoom

            if (capabilities.zoom) {
                setZoomCap({
                    min: capabilities.zoom.min,
                    max: capabilities.zoom.max,
                    step: capabilities.zoom.step
                })
                setZoom(capabilities.zoom.min)
            } else {
                setZoomCap(null)
            }

        } catch (err: any) {
            console.error("Error accessing camera:", err)
            setError("Could not access camera. Please check permissions.")
        }
    }, [facingMode])

    const handleZoom = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newZoom = parseFloat(e.target.value)
        setZoom(newZoom)

        if (stream) {
            const videoTrack = stream.getVideoTracks()[0]
            try {
                await videoTrack.applyConstraints({
                    advanced: [{ zoom: newZoom }] as any
                })
            } catch (err) {
                console.error("Error setting zoom:", err)
            }
        }
    }

    useEffect(() => {
        if (!recordedUrl) {
            startCamera()
        }
        return () => {
            stream?.getTracks().forEach(track => track.stop())
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [startCamera, recordedUrl])

    const toggleCamera = () => {
        setFacingMode(prev => prev === "user" ? "environment" : "user")
    }

    const startRecording = () => {
        if (!stream) return

        chunksRef.current = []
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                chunksRef.current.push(e.data)
            }
        }

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' })
            const url = URL.createObjectURL(blob)
            setRecordedUrl(url)
            setRecordingTime(0)
            if (timerRef.current) clearInterval(timerRef.current)
        }

        mediaRecorder.start()
        setIsRecording(true)

        // Timer for progress
        const startTime = Date.now()
        timerRef.current = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000
            setRecordingTime(elapsed)
            if (elapsed >= 15) {
                stopRecording()
            }
        }, 100)
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop()
            setIsRecording(false)
        }
    }

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording()
        } else {
            startRecording()
        }
    }

    const handleRetake = () => {
        if (recordedUrl) {
            URL.revokeObjectURL(recordedUrl)
        }
        setRecordedUrl(null)
        setIsRecording(false)
    }

    const handleSave = async () => {
        if (!recordedUrl || chunksRef.current.length === 0) return

        try {
            // 1. Get current user and heist
            const { data: { user } } = await createClient().auth.getUser()
            if (!user) return

            // For V1 demo, we'll just assume we're submitting to the active heist
            // In real app, we'd pass the heist ID via props or context
            const { data: heist } = await createClient()
                .from('heists')
                .select('id')
                .eq('status', 'submission')
                .single()

            if (!heist) {
                console.error("No active heist found")
                router.push("/feed")
                return
            }

            // 2. Upload video (Mock for now, or use Supabase Storage if bucket exists)
            // Since we might not have storage set up, we'll use a placeholder URL
            // In production: const { data, error } = await supabase.storage.from('heists').upload(...)
            const videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-1240-large.mp4" // Demo video
            const thumbnailUrl = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80"

            // 3. Create Submission Record
            const { error } = await createClient()
                .from('heist_submissions')
                .insert({
                    heist_id: heist.id,
                    user_id: user.id,
                    video_url: videoUrl,
                    thumbnail_url: thumbnailUrl,
                    pitch_text: "Check out my heist plan! 👻",
                    vote_count: 0
                })

            if (error) throw error

            // 4. Redirect to Heist page to see submission
            router.push("/heist")

        } catch (err) {
            console.error("Error submitting heist:", err)
            // Fallback
            router.push("/heist")
        }
    }

    if (recordedUrl) {
        return (
            <div className="relative h-screen w-full bg-black">
                <video
                    ref={previewRef}
                    src={recordedUrl}
                    autoPlay
                    loop
                    playsInline
                    className="h-full w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-center bg-gradient-to-t from-black/80 to-transparent">
                    <Button
                        variant="ghost"
                        onClick={handleRetake}
                        className="text-white hover:bg-white/20"
                    >
                        Retake
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="bg-yollr-peach hover:bg-yollr-peach/90 text-midnight font-bold px-8"
                    >
                        Post Moment
                    </Button>
                </div>
            </div>
        )
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
                <div className="bg-black/20 backdrop-blur-md rounded-full px-3 py-1 text-white text-sm font-medium">
                    {isRecording ? `${Math.ceil(15 - recordingTime)}s` : "15s"}
                </div>
                <Button variant="ghost" size="icon" className="bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40">
                    <Zap className="h-6 w-6" />
                </Button>
            </div>

            {/* Zoom Slider - Only show if zoom is supported */}
            {zoomCap && (
                <div className="absolute bottom-32 left-0 right-0 px-12 flex items-center justify-center z-20">
                    <div className="bg-black/40 backdrop-blur-md rounded-full px-4 py-2 flex items-center space-x-2 w-full max-w-xs">
                        <span className="text-white text-xs font-bold">1x</span>
                        <input
                            type="range"
                            min={zoomCap.min}
                            max={zoomCap.max}
                            step={zoomCap.step}
                            value={zoom}
                            onChange={handleZoom}
                            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                        />
                        <span className="text-white text-xs font-bold">{zoomCap.max}x</span>
                    </div>
                </div>
            )}

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 flex justify-around items-center bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <Button variant="ghost" size="icon" className="opacity-0">
                    <div className="h-10 w-10" />
                </Button>

                <div className="relative">
                    {isRecording && (
                        <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 -rotate-90 pointer-events-none">
                            <circle
                                cx="48"
                                cy="48"
                                r="46"
                                stroke="white"
                                strokeWidth="4"
                                fill="none"
                                className="opacity-30"
                            />
                            <circle
                                cx="48"
                                cy="48"
                                r="46"
                                stroke="#FF7A5C"
                                strokeWidth="4"
                                fill="none"
                                strokeDasharray={289}
                                strokeDashoffset={289 - (289 * recordingTime) / 15}
                                className="transition-all duration-100 ease-linear"
                            />
                        </svg>
                    )}
                    <button
                        onClick={toggleRecording}
                        className={`h-20 w-20 rounded-full border-[6px] border-white flex items-center justify-center transition-all duration-200 ${isRecording ? "bg-red-500 scale-90 border-transparent" : "bg-transparent hover:scale-105"
                            }`}
                    >
                        {isRecording && <div className="h-8 w-8 bg-white rounded-sm" />}
                    </button>
                </div>

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
