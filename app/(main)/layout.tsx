import { BottomNav } from "@/components/layout/bottom-nav"
import { Header } from "@/components/layout/header"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-midnight pb-20 pt-14">
            <Header />
            <main className="px-4 py-4">{children}</main>
            <BottomNav />
        </div>
    )
}
