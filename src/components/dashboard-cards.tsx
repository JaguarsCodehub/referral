import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const cards = [
  { id: 1, points: 500, status: 'Claim', title: 'Welcome Points' },
  { id: 2, points: 2000, status: 'Share', title: 'Share on Twitter' },
  { id: 3, points: 2000, status: 'Soon', title: 'COMING SOON' },
  { id: 4, points: 1000, status: 'Soon', title: 'COMING SOON' },
  { id: 5, points: 4000, status: 'Soon', title: 'COMING SOON' },
  { id: 6, points: 2000, status: 'Soon', title: 'COMING SOON' },
  { id: 7, points: 4000, status: 'Soon', title: 'COMING SOON' },
  { id: 8, points: 2000, status: 'Soon', title: 'COMING SOON' },
];

const DashboardCards = ({ userId }: { userId: string }) => {
  const router = useRouter()
  const [claimed, setClaimed] = useState<boolean[]>(new Array(cards.length).fill(false));

  const [loading, setLoading] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);


  useEffect(() => {
    // Load claimed status from local storage
    const claimedStatus = localStorage.getItem('claimedStatus');
    if (claimedStatus) {
      setClaimed(JSON.parse(claimedStatus));
    }

    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/');
      } else {
        fetchUserData(data.session.user.id);
      }
    };

    checkAuth();

  }, []);

  const fetchUserData = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user')
        .select('referral_code')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setReferralCode(data.referral_code);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (id: number) => {
    if (claimed[id - 1]) return;

    // Add points based on card
    const pointsToAdd = cards.find(card => card.id === id)?.points || 0;

    // Update the user's points in the database
    const response = await fetch('/api/updateUserPoints', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, newPoints: pointsToAdd }),
    });

    if (response.ok) {
      // Update claimed status locally and in local storage
      const newClaimedStatus = [...claimed];
      newClaimedStatus[id - 1] = true;
      setClaimed(newClaimedStatus);
      localStorage.setItem('claimedStatus', JSON.stringify(newClaimedStatus));
    } else {
      console.error('Failed to claim points');
    }
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(
      'I just applied for the @wowBaoBaoXYZ NFT Whitelist!'
    );
    const url = `https://twitter.com/intent/tweet?url=https%3A%2F%2Fcatcents.io%2F%3Fref%3D${referralCode}&text=Join%20me%20at%20catcents%20&hashtags=%23catcents`;
    window.open(url, '_blank');
  };

  return (
    <div className='bg-black text-white flex flex-col justify-center items-center p-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:-ml-56'>
        {cards.map((card) => (
          <div
            key={card.id}
            className='p-4 w-44 h-40 bg-black/40 border border-white rounded-lg shadow-lg flex flex-col items-center'
          >
            <div className='text-lg mb-2'>{card.points}</div>
            <div
              className={`px-2 py-1 rounded-full ${card.status === 'Claim' || card.status === 'Share'
                ? claimed[card.id - 1]
                  ? 'bg-green-500'
                  : 'bg-purple-500 cursor-pointer'
                : 'bg-gray-600'
                } mb-2`}
              onClick={() => {
                if (card.status === 'Claim' && !claimed[card.id - 1]) {
                  handleClaim(card.id);
                } else if (card.status === 'Share' && !claimed[card.id - 1]) {
                  shareOnTwitter();
                }
              }}
            >
              {card.status === 'Claim' && claimed[card.id - 1] ? 'Claimed!' : card.status}
            </div>
            <div className='text-center'>{card.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardCards;
