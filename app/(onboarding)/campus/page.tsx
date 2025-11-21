'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { MapPin, School, Search } from "lucide-react";

export default function CampusSelectionPage() {
    const router = useRouter();
    const [search, setSearch] = useState("");

    // Mock Data
    const nearbyCampuses = [
        { id: "1", name: "UT Austin", type: "University", distance: "0.5 mi" },
        { id: "2", name: "Austin High", type: "High School", distance: "2.1 mi" },
    ];

    const handleSelect = (id: string) => {
        // Save campus selection to user profile
        router.push("/feed");
    };

    return (
        <div className="min-h-screen bg-midnight p-6 pt-12">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white mb-2">Find your campus</h1>
                <p className="text-muted-foreground">We found these schools near you.</p>
            </div>

            <div className="space-y-4 mb-8">
                {nearbyCampuses.map((campus) => (
                    <button
                        key={campus.id}
                        onClick={() => handleSelect(campus.id)}
                        className="w-full flex items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left"
                    >
                        <div className="h-12 w-12 rounded-full bg-yollr-cyan/20 flex items-center justify-center mr-4">
                            <School className="h-6 w-6 text-yollr-cyan" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">{campus.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center">
                                <MapPin className="h-3 w-3 mr-1" /> {campus.distance} • {campus.type}
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-midnight px-2 text-muted-foreground">Or search manually</span>
                </div>
            </div>

            <div className="mt-6 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Search for your school..."
                    className="pl-10 bg-white/5 border-white/10 h-12"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>
    );
}
