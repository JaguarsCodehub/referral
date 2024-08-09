'use client';
import { CardWithForm } from '@/components/card-form';
import { Navbar } from '@/components/navbar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const Form = () => {
    const router = useRouter();
    const [formFilled, setFormFilled] = useState(false);

    useEffect(() => {
        const fetchSession = async () => {
            const { data } = await supabase.auth.getSession()
            console.log(data)
        }
        fetchSession()
    }, [])

    useEffect(() => {
        const checkAuth = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                router.push('/');
            } else {
                const { user } = data.session;
                const { data: userInfo } = await supabase
                    .from('user')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                if (userInfo && userInfo.twitter_username && userInfo.discord_username) {
                    router.push('/dashboard');
                } else {
                    setFormFilled(true);
                }
            }
        };

        checkAuth();
    }, [router]);

    return (
        <div>
            <Navbar />
            <div className='bg-black flex h-screen items-center justify-center p-12 md:p-24'>
                <Image
                    className='hidden md:block'
                    src='/cat1.png'
                    alt='image'
                    width={500}
                    height={500}
                />
                {formFilled && (
                    <div className='mt-20'>
                        <CardWithForm />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Form;
