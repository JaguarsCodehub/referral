'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import DashboardCards from '@/components/dashboard-cards';
import RunningString from '@/components/running-string';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const Quests = () => {
    const [points, setPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const session = await supabase.auth.getSession(); // Fetch the session details
                setUserId(session?.data.session?.user.id || null);
            } catch (err) {
                console.error('Failed to fetch user session', err);
                setError('Failed to fetch user session');
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (userId) {
                const res = await fetch(`/api/getUserPoints?user_id=${userId}`);
                const data = await res.json();
                setPoints(data.points || 0);
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    if (loading) {
        return (
            <div className='bg-black h-screen flex items-center justify-center'>
                <p className='text-xl font-semibold text-white'>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='bg-black h-screen flex items-center justify-center'>
                <p className='text-xl font-semibold text-red-500'>{error}</p>
            </div>
        );
    }

    return (
        <div className='bg-black h-screen'>
            <Navbar />
            <div className='bg-black pt-28'>
                <div className='p-12'>
                    <h1 className='text-4xl text-white font-semibold'>
                        Complete quests & earn more points!
                    </h1>
                    <p className='text-purple-400 text-xl'>
                        Note: your total points will be added to the playground beta test.
                    </p>
                </div>
                <div className='p-12'>
                    <h2 className='text-4xl text-white font-semibold mb-4'>
                        YOUR TOTAL POINTS: {points}
                    </h2>
                    {userId && <DashboardCards userId={userId} />}
                </div>
            </div>
            <RunningString />
        </div>
    );
};

export default Quests;
