'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-[var(--color-dim)] dark:text-[var(--color-dark-dim)]" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search submissions..."
        className="w-full rounded-lg border border-[var(--color-dim)] bg-[var(--color-forground)] py-2.5 pr-4 pl-10 text-[var(--color-dark-forground)] placeholder-[var(--color-dim)] transition-colors focus:border-transparent focus:ring-2 focus:ring-[var(--color-bright)] focus:outline-none dark:border-[var(--color-dark-dim)] dark:bg-[var(--color-dark-forground)] dark:text-[var(--color-forground)] dark:placeholder-[var(--color-dark-dim)] dark:focus:ring-[var(--color-dark-bright)]"
      />
    </div>
  );
}
