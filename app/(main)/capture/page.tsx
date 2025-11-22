import { Suspense } from "react"
import { CameraView } from "@/components/features/camera/camera-view"

export default function CapturePage() {
    return (
        <Suspense fallback={<div className="h-screen w-full bg-black" />}>
            <CameraView />
        </Suspense>
    )
}
