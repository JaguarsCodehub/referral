'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CardWithForm } from '@/components/card-form';
import { Navbar } from '@/components/navbar';
import Image from 'next/image';

const Home = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const ref = searchParams.get('ref');



  return (
    <div>
      <Navbar />
      <div className='flex h-screen items-center justify-center p-12 md:p-24'>
        <Image className='' src={require('../../public/cat1.png')} alt='image' width={500} height={500} />
        <div className='mt-20'>
          <CardWithForm />
        </div>
      </div>
    </div>

  );
};

export default Home;
