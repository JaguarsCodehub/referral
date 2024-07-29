'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Spinner from '@/components/Spinner';
import { Navbar } from '@/components/navbar';
import Image from 'next/image';
import RunningString from '@/components/running-string';
import DashboardCards from '@/components/dashboard-cards';

const Dashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referral_code = searchParams.get('referral_code');
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `/api/getUserPoints?referral_code=${referral_code}`
      );
      const data = await res.json();
      setPoints(data.points);
    };

    if (referral_code) {
      fetchData();
    }
  }, [referral_code]);

  const handleSpinComplete = async (newPoints: number) => {
    setPoints(points + newPoints);

    // Update the user's points in the database
    await fetch('/api/updateUserPoints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ referral_code, newPoints }),
    });
  };

  return (
    <div>
      <Navbar />
      <div className='bg-black p-12 mt-12'>
        {/* <div className='flex items-center justify-center p-16 mt-12'>
          <p className='text-3xl text-center font-semibold text-purple-500'>Dive into the <span className=' text-white'>most exclusive nft</span> of all time and stand a chance to earn referral points !</p>
        </div> */}
        <div className='px-4 md:px-24 py-6 mt-8'>
          <div className=''>
            <p className='text-purple-500 text-2xl font-semibold'>
              Your referral link: {''}
            </p>
            <p className='  text-white  text-2xl'>{`http://localhost:3000/?ref=${referral_code}`}</p>
          </div>
          <p className='text-purple-300'>
            Share this link with friends and earn referral points based on their
            joining status
          </p>
        </div>
        <div className='px-4 md:px-24'>
          <h2 className='text-4xl text-white font-medium'>
            YOUR POINTS: {points}
          </h2>
        </div>

        <Spinner onComplete={handleSpinComplete} />
      </div>
      <div>
        <DashboardCards />
      </div>
      <RunningString />
    </div>
  );
};

export default Dashboard;
