'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { MapPin, School, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function CampusSelectionPage() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [campuses, setCampuses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [locationStatus, setLocationStatus] = useState<"locating" | "found" | "denied">("locating");
    const supabase = createClient();

    useEffect(() => {
        const fetchCampuses = async () => {
            // 1. Try to get user location
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        try {
                            const { latitude, longitude } = position.coords;
                            console.log("Got location:", latitude, longitude);

                            const { data, error } = await supabase
                                .rpc('get_nearest_campus', {
                                    user_lat: latitude,
                                    user_long: longitude
                                });

                            if (error) throw error;

                            if (data && data.length > 0) {
                                setCampuses(data);
                                setLocationStatus("found");
                            } else {
                                // Fallback if no campuses near (shouldn't happen with limit 5, but good safety)
                                fetchAllCampuses();
                            }
                        } catch (err) {
                            console.error("RPC Error:", err);
                            fetchAllCampuses();
                        } finally {
                            setLoading(false);
                        }
                    },
                    (error) => {
                        console.warn("Geolocation denied/error:", error);
                        setLocationStatus("denied");
                        fetchAllCampuses();
                        setLoading(false);
                    }
                );
            } else {
                console.log("Geolocation not supported");
                setLocationStatus("denied");
                fetchAllCampuses();
                setLoading(false);
            }
        };

        const fetchAllCampuses = async () => {
            const { data, error } = await supabase
                .from('campuses')
                .select('*')
                .order('name');

            if (data) setCampuses(data);
        };

        fetchCampuses();
    }, []);

    const handleSelect = async (campusId: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            // If no user, we might be in a dev/preview mode or they need to sign in.
            // For now, let's assume they are anon or we just push them to feed if no user.
            if (!user) {
                console.warn("No authenticated user found. Redirecting to feed anyway (demo mode).");
                router.push("/feed");
                return;
            }

            // Upsert user to ensure they exist in public.users
            const { error } = await supabase
                .from('users')
                .upsert({
                    id: user.id,
                    campus_id: campusId,
                    // Add default fields if new
                    xp_total: 0,
                    created_at: new Date().toISOString()
                }, { onConflict: 'id' })
                .select();

            if (error) {
                console.error("Error updating user campus:", error);
                // If error is RLS related, we might still want to let them through?
                // But for now, let's throw to catch block.
                throw error;
            }

            console.log("Joined campus successfully!");
            router.push("/feed");
        } catch (error) {
            console.error("Error joining campus:", error);
            // Fallback: just go to feed if DB fails, so user isn't stuck
            router.push("/feed");
        }
    };

    const filteredCampuses = campuses.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-midnight p-6 pt-12">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white mb-2">Find your campus</h1>
                <p className="text-muted-foreground">
                    {locationStatus === 'locating' ? "Locating you..." :
                        locationStatus === 'found' ? "Campuses near you" :
                            "Select your campus to join the heist."}
                </p>
            </div>

            <div className="space-y-4 mb-8">
                {loading ? (
                    <div className="text-white/50 text-center py-8 animate-pulse">
                        Finding nearby campuses...
                    </div>
                ) : filteredCampuses.map((campus) => (
                    <button
                        key={campus.id}
                        onClick={() => handleSelect(campus.id)}
                        className="w-full flex items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left group"
                    >
                        <div className="h-12 w-12 rounded-full bg-yollr-cyan/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                            <School className="h-6 w-6 text-yollr-cyan" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">{campus.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center">
                                <MapPin className="h-3 w-3 mr-1 text-yollr-pink" />
                                {campus.location_name || "Unknown Location"}
                            </p>
                        </div>
                    </button>
                ))}

                {!loading && filteredCampuses.length === 0 && (
                    <div className="text-white/50 text-center py-4">No campuses found.</div>
                )}
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
                    className="pl-10 bg-white/5 border-white/10 h-12 text-white placeholder:text-white/30 focus:border-yollr-cyan/50 transition-colors"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>
    );
}
