import Link from 'next/link';
import { Globe } from 'lucide-react';
import DarkModeToggle from '@/app/components/ui/DarkModeToggle';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { Lang } from '@/app/lib/types/lang';

interface HeaderProps {
  lang: Lang;
}

export default async function Header({ lang }: HeaderProps) {
  const dict = await getDictionary(lang);
  const buttonText = lang === 'fa' ? 'English' : 'فارسی';

  return (
    <header className="bg-forground dark:bg-dark-forground shadow-lg">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href={`/${lang}`}
              className="text-bright dark:text-dark-bright hover:text-dim dark:hover:text-dark-dim text-xl font-semibold transition-colors"
            >
              {dict.site.shortTitle}
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <Link
              href={`/${lang === 'fa' ? 'en' : 'fa'}`}
              className="bg-bright dark:bg-dark-bright text-forground dark:text-dark-forground hover:bg-dim dark:hover:bg-dark-dim inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200"
            >
              {buttonText}
              <Globe className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
