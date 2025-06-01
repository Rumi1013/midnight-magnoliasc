import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Latisha Vincent-Waters | Digital Marketing Strategist & SEO Expert',
  description: 'Professional digital marketing strategist and SEO expert helping businesses grow through data-driven strategies, web development, and innovative digital solutions.',
  keywords: 'digital marketing, SEO, web development, analytics, strategy, South Carolina',
  authors: [{ name: 'Latisha Vincent-Waters' }],
  openGraph: {
    title: 'Latisha Vincent-Waters | Digital Marketing Strategist',
    description: 'Professional digital marketing strategist and SEO expert',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latisha Vincent-Waters | Digital Marketing Strategist',
    description: 'Professional digital marketing strategist and SEO expert',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
