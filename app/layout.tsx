import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Yollr",
    description: "Campus Heists — a weekly reality show.",
    manifest: "/manifest.json",
    viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

// ... imports

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                {children}
                <Toaster />
            </body>
        </html>
    );
}
