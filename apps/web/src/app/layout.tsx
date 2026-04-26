import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Validate environment variables on server startup
import '@/lib/env-validation';

import { Navbar } from '@/components/navbar';
import { WalletProvider } from "@/components/wallet-provider"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'my-celo-app',
  description: 'A new Celo blockchain project',
  other: {
    "talentapp:project_verification":
      "e28790b738555691672fb4acce2b8f5505ee16d9182e035084d29cde541d0cab1ec0e4b02dd60493429d5e2f67b43a2f2797a4e3ab46b38205d3cc0fcc4cf903",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navbar is included on all pages */}
        <div className="relative flex min-h-screen flex-col">
          <WalletProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </WalletProvider>
        </div>
      </body>
    </html>
  );
}
