'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const Home = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const ref = searchParams.get('ref');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, referred_by: ref }),
    });

    const data = await res.json();

    if (res.ok) {
      router.push(`/dashboard?referral_code=${data.referral_code}`);
    } else {
      setError(data.error);
    }
  };

  return (
    <div className='flex p-24'>
      <h1>Signup</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default Home;
