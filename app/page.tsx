import { redirect } from "next/navigation";

export default function Home() {
    // In a real app, check auth session here
    // For V1 demo, we'll redirect to login
    redirect("/login");
}
