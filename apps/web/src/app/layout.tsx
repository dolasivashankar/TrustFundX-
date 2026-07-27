import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'TrustFundX – AI-Powered Disaster Relief Network',
    template: '%s | TrustFundX',
  },
  description:
    'TrustFundX combines AI and Algorand blockchain to provide fast, transparent, and secure disaster relief funding. Donate with confidence — every transaction is verified on-chain.',
  keywords: [
    'disaster relief', 'blockchain donation', 'Algorand', 'AI verification',
    'transparent funding', 'emergency relief', 'crypto donation', 'TrustFundX',
  ],
  authors: [{ name: 'TrustFundX Team' }],
  creator: 'TrustFundX',
  publisher: 'TrustFundX',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://trustfundx.com'),
  openGraph: {
    title: 'TrustFundX – AI-Powered Disaster Relief Network',
    description: 'Transparent, blockchain-verified disaster relief powered by AI and Algorand.',
    url: '/',
    siteName: 'TrustFundX',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'TrustFundX' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrustFundX – AI-Powered Disaster Relief Network',
    description: 'Transparent, blockchain-verified disaster relief powered by AI and Algorand.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#FFD700',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-[#0A0A0A] text-white antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
