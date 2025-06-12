'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-[var(--color-dim)] dark:text-[var(--color-dark-dim)]" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search submissions..."
        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--color-dim)] dark:border-[var(--color-dark-dim)] bg-[var(--color-forground)] dark:bg-[var(--color-dark-forground)] text-[var(--color-dark-forground)] dark:text-[var(--color-forground)] placeholder-[var(--color-dim)] dark:placeholder-[var(--color-dark-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--color-bright)] dark:focus:ring-[var(--color-dark-bright)] focus:border-transparent transition-colors"
      />
    </div>
  );
} 