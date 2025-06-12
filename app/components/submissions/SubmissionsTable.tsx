'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { fetchInsuranceSubmissions } from '@/app/lib/api/insurance';
import type { Submission } from '@/app/lib/types/submissions';

interface SubmissionsTableProps {
  searchQuery: string;
  visibleColumns: string[];
}

const ITEMS_PER_PAGE = 10;

export default function SubmissionsTable({ searchQuery, visibleColumns }: SubmissionsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Submission | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        setLoading(true);
        const response = await fetchInsuranceSubmissions();
        setSubmissions(response.data);
        setAvailableColumns(response.columns);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load submissions');
        setSubmissions([]);
        setAvailableColumns([]);
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, []);

  const filteredData = useMemo(() => {
    if (!submissions) return [];
    return submissions.filter(submission =>
      Object.values(submission).some(value =>
        value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, submissions]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

  const handleSort = (key: keyof Submission) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    });
  };

  const columnConfig = {
    'Full Name': { label: 'Full Name', sortable: true },
    'Age': { label: 'Age', sortable: true },
    'Gender': { label: 'Gender', sortable: true },
    'Insurance Type': { label: 'Insurance Type', sortable: true },
    'City': { label: 'City', sortable: true },
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-[var(--color-dim)] dark:bg-[var(--color-dark-dim)] rounded-lg opacity-20"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-[var(--color-dim)] dark:bg-[var(--color-dark-dim)] rounded-lg opacity-20"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/50">
          <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-red-600 dark:text-red-400">{error}</span>
        </div>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="py-12 text-center text-[var(--color-dim)] dark:text-[var(--color-dark-dim)]">
        No submissions found
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-dim)] dark:border-[var(--color-dark-dim)]">
              {visibleColumns.map((columnKey) => {
                const column = columnConfig[columnKey as keyof typeof columnConfig];
                if (!column) return null;
                return (
                  <th
                    key={columnKey}
                    className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-dark-forground)] dark:text-[var(--color-forground)]"
                  >
                    <button
                      className="flex items-center space-x-1 focus:outline-none"
                      onClick={() => column.sortable && handleSort(columnKey as keyof Submission)}
                    >
                      <span>{column.label}</span>
                      {column.sortable && sortConfig.key === columnKey && (
                        <span className="w-4 h-4">
                          {sortConfig.direction === 'asc' ? (
                            <ChevronUpIcon />
                          ) : (
                            <ChevronDownIcon />
                          )}
                        </span>
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((submission) => (
              <tr
                key={submission.id}
                className="border-b border-[var(--color-dim)] dark:border-[var(--color-dark-dim)] hover:bg-[var(--color-background)] dark:hover:bg-[var(--color-dark-background)] transition-colors"
              >
                {visibleColumns.map((columnKey) => {
                  const value = submission[columnKey as keyof Submission];
                  if (value === undefined) return null;
                  return (
                    <td
                      key={columnKey}
                      className="px-6 py-4 text-sm text-[var(--color-dark-forground)] dark:text-[var(--color-forground)]"
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-dim)] dark:border-[var(--color-dark-dim)]">
        <div className="text-sm text-[var(--color-dark-forground)] dark:text-[var(--color-forground)]">
          Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, sortedData.length)} of {sortedData.length} results
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] text-[var(--color-dark-forground)] dark:text-[var(--color-forground)] disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] text-[var(--color-dark-forground)] dark:text-[var(--color-forground)] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 