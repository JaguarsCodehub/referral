import { Montserrat } from 'next/font/google';
import './globals.css';


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
