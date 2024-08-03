// app/page.tsx or pages/index.tsx
'use client';
import { CardWithForm } from '@/components/card-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc'; // Importing Google icon

export const dynamic = 'force-dynamic';

const Home = () => {
  // const router = useRouter();

  // useEffect(() => {
  //   const referralCode = localStorage.getItem('referral_code');
  //   if (referralCode) {
  //     router.push(`/dashboard?referral_code=${referralCode}`);
  //   }
  // }, [router]);

  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleAuthChange = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const { user } = data.session;
        // await createOrUpdateUser(user);
        router.push('/form');
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    router.push('/form')

    if (error) {
      setError(error.message);
    }
  };






  return (
    <div>
      {/* <Navbar /> */}
      <div className='bg-black flex h-screen items-center justify-center p-12 md:p-24'>
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
              <FcGoogle className="text-2xl" /> {/* Google icon */}
              <span>Sign in with Google</span>
            </Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
};

export default Home;
