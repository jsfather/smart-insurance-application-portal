import 'server-only';
import { Lang } from '@/app/lib/types/lang';

const dictionaries = {
  en: () =>
    import('@/app/dictionaries/en.json').then((module) => module.default),
  fa: () =>
    import('@/app/dictionaries/fa.json').then((module) => module.default),
};

export const getDictionary = async (locale: Lang) =>
  dictionaries[locale]();
