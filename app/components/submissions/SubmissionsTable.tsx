'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { fetchInsuranceSubmissions } from '@/app/lib/api/insurance';
import type { Submission } from '@/app/lib/types/submissions';

interface SubmissionsTableProps {
  searchQuery: string;
  visibleColumns: string[];
}

const ITEMS_PER_PAGE = 10;

export default function SubmissionsTable({
  searchQuery,
  visibleColumns,
}: SubmissionsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
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
        if (Array.isArray(response.data)) {
          setSubmissions(response.data);
          setError(null);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load submissions'
        );
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, []);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex =
      (currentPage - 1) * ITEMS_PER_PAGE + result.source.index;
    const destinationIndex =
      (currentPage - 1) * ITEMS_PER_PAGE + result.destination.index;

    setSubmissions((prevSubmissions) => {
      const newSubmissions = [...prevSubmissions];
      const [removed] = newSubmissions.splice(sourceIndex, 1);
      newSubmissions.splice(destinationIndex, 0, removed);
      return newSubmissions;
    });
  };

  const filteredData = useMemo(() => {
    if (!submissions) return [];
    return submissions.filter((submission) =>
      Object.values(submission).some((value) =>
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
    Age: { label: 'Age', sortable: true },
    Gender: { label: 'Gender', sortable: true },
    'Insurance Type': { label: 'Insurance Type', sortable: true },
    City: { label: 'City', sortable: true },
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-10 rounded-lg bg-[var(--color-dim)] opacity-20 dark:bg-[var(--color-dark-dim)]"></div>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-lg bg-[var(--color-dim)] opacity-20 dark:bg-[var(--color-dark-dim)]"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="inline-flex items-center rounded-lg bg-red-50 px-4 py-2 dark:bg-red-900/50">
          <svg
            className="mr-2 h-5 w-5 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
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
        <DragDropContext onDragEnd={handleDragEnd}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-dim)] dark:border-[var(--color-dark-dim)]">
                {visibleColumns.map((columnKey) => {
                  const column =
                    columnConfig[columnKey as keyof typeof columnConfig];
                  if (!column) return null;
                  return (
                    <th
                      key={columnKey}
                      className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-dark-forground)] dark:text-[var(--color-forground)]"
                    >
                      <button
                        className="flex items-center space-x-1 focus:outline-none"
                        onClick={() =>
                          column.sortable &&
                          handleSort(columnKey as keyof Submission)
                        }
                      >
                        <span>{column.label}</span>
                        {column.sortable && sortConfig.key === columnKey && (
                          <span className="h-4 w-4">
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
            <Droppable droppableId="submissions">
              {(provided) => (
                <tbody
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="relative"
                >
                  {paginatedData.map((submission, index) => (
                    <Draggable
                      key={submission.id}
                      draggableId={submission.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`border-b border-[var(--color-dim)] transition-colors dark:border-[var(--color-dark-dim)] ${
                            snapshot.isDragging
                              ? 'bg-[var(--color-background)] dark:bg-[var(--color-dark-background)]'
                              : 'hover:bg-[var(--color-background)] dark:hover:bg-[var(--color-dark-background)]'
                          }`}
                        >
                          {visibleColumns.map((columnKey) => {
                            const value =
                              submission[columnKey as keyof Submission];
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </table>
        </DragDropContext>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--color-dim)] px-6 py-4 dark:border-[var(--color-dark-dim)]">
        <div className="text-sm text-[var(--color-dark-forground)] dark:text-[var(--color-forground)]">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{' '}
          {Math.min(currentPage * ITEMS_PER_PAGE, sortedData.length)} of{' '}
          {sortedData.length} results
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="rounded-lg bg-[var(--color-background)] px-3 py-1 text-[var(--color-dark-forground)] disabled:opacity-50 dark:bg-[var(--color-dark-background)] dark:text-[var(--color-forground)]"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="rounded-lg bg-[var(--color-background)] px-3 py-1 text-[var(--color-dark-forground)] disabled:opacity-50 dark:bg-[var(--color-dark-background)] dark:text-[var(--color-forground)]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
