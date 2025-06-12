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
    'City'
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-[var(--color-dark-forground)] dark:text-[var(--color-forground)]">
            New Insurance Application
          </h2>
          <DynamicForm />
        </section>

        <section>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-2xl font-semibold text-[var(--color-dark-forground)] dark:text-[var(--color-forground)] mb-4 sm:mb-0">
              Your Insurance Applications
            </h2>
            <ColumnCustomizer 
              visibleColumns={visibleColumns}
              onColumnChange={setVisibleColumns}
            />
          </div>

          <div className="mb-6">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          <div className="bg-[var(--color-forground)] dark:bg-[var(--color-dark-forground)] rounded-xl shadow-sm">
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
