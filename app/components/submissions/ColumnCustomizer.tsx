'use client';

import { useState, useRef, useEffect } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

interface ColumnCustomizerProps {
  visibleColumns: string[];
  onColumnChange: (columns: string[]) => void;
}

const ALL_COLUMNS = [
  { key: 'Full Name', label: 'Full Name' },
  { key: 'Age', label: 'Age' },
  { key: 'Gender', label: 'Gender' },
  { key: 'Insurance Type', label: 'Insurance Type' },
  { key: 'City', label: 'City' },
];

export default function ColumnCustomizer({
  visibleColumns,
  onColumnChange,
}: ColumnCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleColumn = (columnKey: string) => {
    if (visibleColumns.includes(columnKey)) {
      if (visibleColumns.length > 1) {
        onColumnChange(visibleColumns.filter((key) => key !== columnKey));
      }
    } else {
      onColumnChange([...visibleColumns, columnKey]);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-lg border border-[var(--color-dim)] bg-[var(--color-forground)] px-4 py-2 text-[var(--color-dark-forground)] transition-colors hover:bg-[var(--color-background)] focus:ring-2 focus:ring-[var(--color-bright)] focus:outline-none dark:border-[var(--color-dark-dim)] dark:bg-[var(--color-dark-forground)] dark:text-[var(--color-forground)] dark:hover:bg-[var(--color-dark-background)] dark:focus:ring-[var(--color-dark-bright)]"
      >
        <AdjustmentsHorizontalIcon className="h-5 w-5" />
        <span>Customize Columns</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-[var(--color-dim)] bg-[var(--color-forground)] shadow-lg dark:border-[var(--color-dark-dim)] dark:bg-[var(--color-dark-forground)]">
          <div className="p-2">
            <div className="mb-2 px-2 py-1 text-sm font-medium text-[var(--color-dark-forground)] dark:text-[var(--color-forground)]">
              Toggle Columns
            </div>
            <div className="space-y-1">
              {ALL_COLUMNS.map((column) => (
                <label
                  key={column.key}
                  className="flex cursor-pointer items-center space-x-2 rounded px-2 py-1.5 hover:bg-[var(--color-background)] dark:hover:bg-[var(--color-dark-background)]"
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(column.key)}
                    onChange={() => toggleColumn(column.key)}
                    className="rounded border-[var(--color-dim)] text-[var(--color-bright)] focus:ring-[var(--color-bright)] dark:border-[var(--color-dark-dim)] dark:text-[var(--color-dark-bright)] dark:focus:ring-[var(--color-dark-bright)]"
                  />
                  <span className="text-sm text-[var(--color-dark-forground)] dark:text-[var(--color-forground)]">
                    {column.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
