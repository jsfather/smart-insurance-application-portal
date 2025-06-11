import { getDictionary } from '@/app/[lang]/dictionaries';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: 'en' | 'fa' }>;
}) {
  const { lang } = await params;

  const dict = await getDictionary(lang);

  return (
    <div className="p-4">
      <div></div>
    </div>
  );
}
