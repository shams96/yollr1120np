import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Users, Clock } from "lucide-react"

export default function HeistPage() {
    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black text-white">Campus Heist</h1>
                <p className="text-yollr-peach font-medium">Week 42 • Voting Phase</p>
            </div>

            <Card className="border-yollr-peach/30 bg-gradient-to-b from-yollr-peach/10 to-transparent">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Trophy className="h-6 w-6 text-yollr-peach" />
                        <span>Prize Pool</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-black text-white">$500</div>
                    <p className="text-sm text-muted-foreground">Sponsored by Joe's Pizza</p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <Users className="h-8 w-8 mb-2 text-yollr-cyan" />
                        <span className="text-2xl font-bold">1,240</span>
                        <span className="text-xs text-muted-foreground">Participants</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <Clock className="h-8 w-8 mb-2 text-yollr-pink" />
                        <span className="text-2xl font-bold">48h</span>
                        <span className="text-xs text-muted-foreground">Time Left</span>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold">Top Submissions</h3>
                {/* List would go here */}
                <div className="p-8 text-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
                    Loading submissions...
                </div>
            </div>

            <Button className="w-full" size="lg">
                Submit Pitch
            </Button>
        </div>
    )
}
