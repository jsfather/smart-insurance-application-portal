'use client';

import { useState } from 'react';
import DynamicForm from '@/app/components/forms/DynamicForm';
import SubmissionsTable from '@/app/components/submissions/SubmissionsTable';
import SearchBar from '@/app/components/submissions/SearchBar';
import ColumnCustomizer from '@/app/components/submissions/ColumnCustomizer';

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleColumns, setVisibleColumns] = useState([
    'Full Name',
    'Age',
    'Gender',
    'Insurance Type',
    'City',
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-12">
        <section>
          <h2 className="mb-6 text-2xl font-semibold text-[var(--color-dark-forground)] dark:text-[var(--color-forground)]">
            New Insurance Application
          </h2>
          <DynamicForm />
        </section>

        <section>
          <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <h2 className="mb-4 text-2xl font-semibold text-[var(--color-dark-forground)] sm:mb-0 dark:text-[var(--color-forground)]">
              Your Insurance Applications
            </h2>
            <ColumnCustomizer
              visibleColumns={visibleColumns}
              onColumnChange={setVisibleColumns}
            />
          </div>

          <div className="mb-6">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          <div className="rounded-xl bg-[var(--color-forground)] shadow-sm dark:bg-[var(--color-dark-forground)]">
            <SubmissionsTable
              searchQuery={searchQuery}
              visibleColumns={visibleColumns}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
