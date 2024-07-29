'use client'
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"


export function CardWithForm() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [twitterUsername, setTwitterUsername] = React.useState('');
    const [discordUsername, setDiscordUsername] = React.useState('');
    const [error, setError] = React.useState('');
    const ref = searchParams.get('ref');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ twitter_username: twitterUsername, discord_username: discordUsername, referred_by: ref }),
        });

        const data = await res.json();

        if (res.ok) {
            router.push(`/dashboard?referral_code=${data.referral_code}`);
        } else {
            setError(data.error);
        }
    };

    return (
        <Card className="w-[350px] bg-purple-600">
            <CardHeader>
                <CardTitle className="text-black">Welcome to Catcents</CardTitle>
                <CardDescription className="text-slate-900">Early Access just for you </CardDescription>
            </CardHeader>
            <CardContent>
                {error && <p>{error}</p>}
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Twitter Username</Label>
                            <Input id="twitterUsername"
                                placeholder="Enter your twitter username"
                                type="text"
                                value={twitterUsername}
                                onChange={(e) => setTwitterUsername(e.target.value)}
                                required />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="framework">Discord Username</Label>
                            <Input id="name"
                                placeholder="Enter your discord username"
                                value={discordUsername}
                                type="text"
                                onChange={(e) => setDiscordUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button onClick={handleSubmit} type="submit">Submit</Button>
            </CardFooter>
        </Card>
    )
}
