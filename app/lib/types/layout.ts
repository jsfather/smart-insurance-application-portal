import { Lang } from './lang';

export interface LayoutParams {
  lang: Lang;
}

export interface RootLayoutProps {
  children: React.ReactNode;
  params: LayoutParams;
} 