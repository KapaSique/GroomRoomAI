import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import { getUserFromCookies } from '@/lib/auth';

const inter = Inter({ subsets: ['cyrillic', 'latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'GroomRoom | Премиум салон красоты для питомцев',
  description: 'Система заявок для салона красоты домашних животных',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromCookies();

  return (
    <html lang="ru" className={inter.variable}>
      <body className={inter.className}>
        <Header user={user as any} />
        <main>{children}</main>
      </body>
    </html>
  );
}
