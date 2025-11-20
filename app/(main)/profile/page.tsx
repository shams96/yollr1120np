import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, Share2 } from "lucide-react"

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4 pt-4">
                <Avatar className="h-24 w-24 border-4 border-yollr-peach">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white">John Doe</h1>
                    <p className="text-yollr-cyan font-medium">Class of 2026</p>
                </div>

                <div className="flex space-x-4">
                    <div className="text-center">
                        <div className="text-xl font-bold text-white">12</div>
                        <div className="text-xs text-muted-foreground">Streak</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold text-white">1.4k</div>
                        <div className="text-xs text-muted-foreground">XP</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold text-white">5</div>
                        <div className="text-xs text-muted-foreground">Wins</div>
                    </div>
                </div>
            </div>

            <Card>
                <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="font-medium">Heist Pass</span>
                        <span className="text-yollr-lime text-sm font-bold">Level 12</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10">
                        <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-yollr-lime to-green-400" />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                </Button>
                <Button variant="outline" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Profile
                </Button>
            </div>
        </div>
    )
}
