'use client';
import { CardWithForm } from '@/components/card-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Navbar } from '@/components/navbar';

export const dynamic = 'force-dynamic';

const Home = () => {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleAuthChange = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          const { user } = data.session;
          const { data: existingUsers, error } = await supabase
            .from('user')
            .select('*')
            .eq('id', user.id);

          if (error) {
            console.error('Error fetching users:', error);
          } else if (existingUsers.length === 0) {
            // No existing user, handle the case where user is new
            const referralCode = createReferralCode();
            await supabase
              .from('user')
              .insert([{ id: user.id, email: user.email, referral_code: referralCode, points: 100 }]);
          } else if (existingUsers.length === 1) {
            // One existing user, proceed as normal
            const existingUser = existingUsers[0];
            // Handle existing user
          } else {
            // More than one row returned, handle accordingly
            console.error('Unexpected number of rows returned:', existingUsers.length);
          }
          router.push('/form');
        }
      } catch (error) {
        console.error('Error handling auth change:', error);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);



  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) {
      setError(error.message);
    }
  };

  const createReferralCode = () => {
    return `CAT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  };

  return (
    <div>
      <div className='bg-black flex h-screen items-center justify-center p-12 md:p-24'>
        {/* <Navbar /> */}
        <Card className="w-[350px] bg-black">
          <CardHeader>
            <CardTitle className='text-white'>Welcome to Catcents</CardTitle>
            <CardDescription className='text-white'>Early Access just for you.</CardDescription>
          </CardHeader>
          <CardContent>
            <Image src='/cat2.png' alt='image' className='' width={300} height={200} />
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={handleGoogleSignIn} className="flex items-center space-x-2">
              <FcGoogle className="text-2xl" />
              <span>Sign in with Google</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Home;
