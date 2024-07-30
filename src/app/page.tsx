// app/page.tsx or pages/index.tsx
'use client';
import { CardWithForm } from '@/components/card-form';
import { Navbar } from '@/components/navbar';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

const Home = () => {
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
        <div className='mt-20'>
          <CardWithForm />
        </div>
      </div>
    </div>
  );
};

export default Home;
