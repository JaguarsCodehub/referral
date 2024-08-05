'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function CardWithForm() {
  const router = useRouter();
  const [twitterUsername, setTwitterUsername] = useState('');
  const [discordUsername, setDiscordUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if the user already has a referral code stored
    const referralCode = localStorage.getItem('referral_code');
    if (referralCode) {
      router.push(`/dashboard?referral_code=${referralCode}`);
    }
  }, [router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Fetch session and get the access token
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      setError('Failed to retrieve session. Please log in.');
      return;
    }

    const accessToken = data.session.access_token;

    try {
      const response = await fetch('/api/createUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ twitter_username: twitterUsername, discord_username: discordUsername }),
      });

      router.push('/dashboard')

      const result = await response.json();
      if (response.ok) {
        // Store the referral code in local storage
        if (result.referral_code) {
          localStorage.setItem('referral_code', result.referral_code);
          router.push(`/dashboard?referral_code=${result.referral_code}`);
        } else {
          setError('No referral code returned from server.');
        }
      } else {
        setError(result.error || 'Failed to create user.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <Card className='w-[350px] bg-purple-600'>
      <CardHeader>
        <CardTitle className='text-black'>Welcome to Catcents</CardTitle>
        <CardDescription className='text-slate-900'>
          Early Access just for you
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-600">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className='grid w-full items-center gap-4'>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='twitterUsername'>Twitter Username</Label>
              <Input
                id='twitterUsername'
                placeholder='Enter your Twitter username'
                type='text'
                value={twitterUsername}
                onChange={(e) => setTwitterUsername(e.target.value)}
                required
              />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='discordUsername'>Discord Username</Label>
              <Input
                id='discordUsername'
                placeholder='Enter your Discord username'
                value={discordUsername}
                type='text'
                onChange={(e) => setDiscordUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <CardFooter className='flex justify-between mt-10'>
            <Button type='submit'>Submit</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
