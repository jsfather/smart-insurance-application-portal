import type { Metadata } from 'next';
import { vazirmatn } from '@/app/fonts';
import '../globals.css';
import Header from '@/app/components/layout/Header';

export const metadata: Metadata = {
  title: 'Smart Insurance',
  description: 'Smart Insurance Application Portal',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: 'en' | 'fa' }>;
}) {
  // Await the params to ensure they're ready
  const { lang } = await params;
  const isRTL = lang === 'fa';
  const direction = isRTL ? 'rtl' : 'ltr';

  return (
    <html lang={lang} dir={direction}>
      <body
        className={`${vazirmatn.variable} font-vazirmatn bg-background dark:bg-dark-background min-h-screen antialiased`}
      >
        <Header lang={lang} />
        <main className="text-bright">{children}</main>
      </body>
    </html>
  );
}
