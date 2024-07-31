'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import DashboardCards from '@/components/dashboard-cards';
import RunningString from '@/components/running-string';

export const dynamic = 'force-dynamic';

const Quests = () => {
    const searchParams = useSearchParams();
    const referral_code = searchParams.get('referral_code');
    const [points, setPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter()

    React.useEffect(() => {
        const referralCode = localStorage.getItem('referral_code');
        if (referralCode) {
            router.push(`/quest?referral_code=${referralCode}`);
        }
    }, [router]);

    useEffect(() => {
        const fetchData = async () => {
            if (referral_code) {
                const res = await fetch(`/api/getUserPoints?referral_code=${referral_code}`);
                const data = await res.json();
                setPoints(data.points);
            }
        };

        fetchData();
    }, [referral_code]);

    return (
        <div className='bg-black h-screen'>
            <Navbar />
            <div className='bg-black pt-28'>
                <div className='p-12'>
                    <h1 className='text-4xl text-white font-semibold'>
                        Complete Quest Tasks and earn real points!
                    </h1>
                    <p className='text-purple-400 text-xl'>
                        You can earn real points by completing some tasks and earning rewards right into your account!
                    </p>
                </div>
                <div className='p-12'>
                    <h2 className='text-4xl text-white font-semibold mb-4'>
                        YOUR POINTS: {points}
                    </h2>
                    <DashboardCards referral_code={referral_code} />
                </div>
            </div>
            <RunningString />
        </div>
    );
};

export default Quests;
