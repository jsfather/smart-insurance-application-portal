import type { Metadata } from 'next';
import { vazirmatn } from '@/app/fonts';
import '@/app/globals.css';
import Header from '@/app/components/layout/Header';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { Lang } from '@/app/lib/types/lang';

export async function generateMetadata({
  params,
}: {
  params: { lang: Lang };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);

  return {
    title: dict.site.shortTitle,
    description: dict.site.fullTitle,
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Lang }>;
}) {
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
