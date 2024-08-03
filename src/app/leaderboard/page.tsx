'use client';

import { Navbar } from '@/components/navbar';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
  twitter_username: string;
  points: number;
}

const Leaderboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const referral_code = searchParams.get('referral_code');
  const [points, setPoints] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const referralCode = localStorage.getItem('referral_code');
    if (referralCode) {
      router.push(`/leaderboard?referral_code=${referralCode}`);
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      if (referral_code) {
        const { data, error } = await supabase
          .from('users')
          .select('points')
          .eq('referral_code', referral_code);

        if (error) {
          setError('Failed to fetch user points.');
        } else if (data && data.length > 0) {
          setPoints(data[0].points);
        }
      }
    };

    fetchData();
  }, [referral_code]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('twitter_username, points')
        .order('points', { ascending: false });

      if (error) {
        setError('Failed to fetch leaderboard.');
      } else {
        setUsers(data);
      }
      setLoading(false);
    };

    fetchLeaderboard();

    // Subscribe to changes in the 'users' table
    const subscription = supabase
      .channel('leaderboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
        fetchLeaderboard(); // Refresh the leaderboard data on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // Clean up subscription on unmount
    };
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-xl font-semibold'>Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-xl font-semibold text-red-500'>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className='container bg-black h-screen py-10 pt-20'>
        <div className='text-center mb-10'>
          <h1 className='text-4xl font-bold text-white p-4 rounded-sm shadow-md inline-block'>
            <span className='font-semibold'>Leaderboard</span>
          </h1>
        </div>
        <div className='bg-purple-600 text-white rounded-lg shadow-md overflow-hidden'>
          <table className='min-w-full leading-normal'>
            <thead>
              <tr className='bg-purple-800 text-left text-xs uppercase font-semibold'>
                <th className='px-5 py-3 border-b border-purple-500'>Rank</th>
                <th className='px-5 py-3 border-b border-purple-500'>
                  Player Username
                </th>
                <th className='px-5 py-3 border-b border-purple-500'>Points</th>
              </tr>
            </thead>
            <tbody className='text-sm divide-y divide-purple-500'>
              {users.map((user, index) => (
                <tr key={index} className='hover:bg-purple-700'>
                  <td className='px-5 py-4'>{index + 1}</td>
                  <td className='px-5 py-4'>{user.twitter_username}</td>
                  <td className='px-5 py-4'>{user.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h2 className='text-3xl text-white font-semibold mt-12'>
            Your Total Points: {points}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
