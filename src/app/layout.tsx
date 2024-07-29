import { Montserrat } from 'next/font/google';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { Navbar } from '@/components/navbar';

const inter = Montserrat({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className} >
        {children}
      </body>
    </html>
  );
}
