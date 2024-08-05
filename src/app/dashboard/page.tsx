'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Spinner from '@/components/Spinner';
import { Navbar } from '@/components/navbar';
import RunningString from '@/components/running-string';
import DashboardCards from '@/components/dashboard-cards';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

export const dynamic = 'force-dynamic';

const Dashboard = () => {
  const searchParams = useSearchParams();
  const referral_code = searchParams.get('referral_code');

  const router = useRouter();
  const { toast } = useToast();
  const [points, setPoints] = useState(0);
  const [spinCooldown, setSpinCooldown] = useState(false);
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState<number | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // Move localStorage retrieval to useEffect to avoid setting state during render
  const [referralcode, setReferralcodeState] = useState<string | null>(null);

  useEffect(() => {
    const storedReferralCode = localStorage.getItem('referral_code');
    if (storedReferralCode) {
      setReferralcodeState(storedReferralCode);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      const referral_code = localStorage.getItem('referral_code');
      if (referral_code) {
        const res = await fetch(
          `/api/getUserPoints?referral_code=${referral_code}`
        );
        const data = await res.json();
        setPoints(data.points);
      } else { }
    };

    fetchData();
  }, [referral_code]);

  useEffect(() => {
    const lastSpinTime = localStorage.getItem('lastSpinTime');
    if (lastSpinTime) {
      const now = new Date().getTime();
      const cooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const timeElapsed = now - parseInt(lastSpinTime, 10);

      if (timeElapsed < cooldownPeriod) {
        setSpinCooldown(true);
        const remainingTime = cooldownPeriod - timeElapsed;
        setCooldownTimeLeft(remainingTime);

        const timer = setInterval(() => {
          setCooldownTimeLeft((prev) => {
            if (prev !== null && prev > 1000) {
              return prev - 1000;
            } else {
              clearInterval(timer);
              setSpinCooldown(false);
              return null;
            }
          });
        }, 1000);
      }
    }
  }, []);

  const handleSpinComplete = async (newPoints: number) => {
    setPoints(points + newPoints);

    await fetch('/api/updateUserPoints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ referral_code, newPoints }),
    });

    const now = new Date().getTime();
    localStorage.setItem('lastSpinTime', now.toString());
    setSpinCooldown(true);
    setCooldownTimeLeft(24 * 60 * 60 * 1000); // 24 hours

    setTimeout(() => {
      setSpinCooldown(false);
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

    toast({
      title: `Congratulations! You earned ${newPoints} points!`,
      description: 'Come back tomorrow to earn more!',
    });
  };

  const copyToClipboard = () => {
    if (referralcode) {
      const referralLink = `https://catcents.io/?ref=${referralcode}`;
      navigator.clipboard
        .writeText(referralLink)
        .then(() => setCopySuccess('Referral link copied!'))
        .catch(() => setCopySuccess('Failed to copy the link.'));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bg-black p-12 mt-12">
        <div className="px-4 md:px-24 py-6 mt-8">
          <div className="">
            <p className="text-purple-500 text-2xl font-semibold">
              Your referral link: {''}
            </p>
            <p className="text-white md:text-2xl">
              {`https://catcents.io/?ref=${referralcode}`}
            </p>
          </div>
          <button
            className="mt-4 bg-purple-800 text-white p-2 rounded"
            onClick={copyToClipboard}
          >
            Copy Referral Link
          </button>
          {copySuccess && <p className="text-purple-300 mt-2">{copySuccess}</p>}
          <p className="text-purple-300 mt-4">
            Share this link with friends and earn referral points based on their
            joining status
          </p>
        </div>
        <div className="px-4 md:px-24">
          <h2 className="text-4xl text-white font-semibold">
            YOUR POINTS: {points}
          </h2>
        </div>

        {spinCooldown ? (
          <div className="px-4 md:px-24 mt-8">
            {cooldownTimeLeft !== null && (
              <div>
                <Spinner onComplete={handleSpinComplete} />
                <p className="text-white text-2xl font-semibold">
                  Spin available in:{' '}
                  {Math.floor(cooldownTimeLeft / 1000 / 60 / 60)}h{' '}
                  {Math.floor((cooldownTimeLeft / 1000 / 60) % 60)}m{' '}
                  {Math.floor((cooldownTimeLeft / 1000) % 60)}s
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-12">
            <div className="px-8 md:px-24">
              <h1 className="text-purple-700 text-2xl md:text-4xl font-semibold">
                Spin your Luck Today !
              </h1>
            </div>
            <Spinner onComplete={handleSpinComplete} />
          </div>
        )}
      </div>

      <div className="p-12 bg-black items-center justify-center flex flex-col min-h-72">
        <h1 className="text-2xl md:text-4xl text-white font-semibold">
          Complete quests and earn points right now !
        </h1>
        <button className="bg-white text-black p-2 rounded-sm font-semibold ml-4 mt-8">
          <Link href="/quest">Join Quests</Link>
        </button>
      </div>

      <RunningString />
    </div>
  );
};

export default Dashboard;

