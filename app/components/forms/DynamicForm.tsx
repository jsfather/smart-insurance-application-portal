'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchDynamicForm, submitForm } from '@/app/lib/api/insurance';
import request from '@/app/lib/api/client';
import type { DynamicForm } from '@/app/lib/types/dynamic-form';

interface FormValues {
  [key: string]: any;
}

interface DynamicOptions {
  [key: string]: string[];
}

interface DynamicOptionsResponse {
  country?: string;
  states?: string[];

  [key: string]: any;
}

export default function DynamicForm() {
  const [forms, setForms] = useState<DynamicForm[] | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<string>('');
  const [formValues, setFormValues] = useState<FormValues>({});
  const [dynamicOptions, setDynamicOptions] = useState<DynamicOptions>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingOptions, setLoadingOptions] = useState<{
    [key: string]: boolean;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const baseInputClasses =
    'w-full px-4 py-2.5 border rounded-lg transition-all duration-200 bg-[var(--color-forground)] dark:bg-[var(--color-dark-forground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-bright)] focus:border-transparent text-[var(--color-dark-forground)] dark:text-[var(--color-forground)]';
  const labelClasses =
    'block text-sm font-medium mb-2 text-[var(--color-dark-forground)] dark:text-[var(--color-forground)]';
  const helperTextClasses =
    'text-xs text-[var(--color-dim)] dark:text-[var(--color-dark-dim)] mt-1';
  const groupClasses =
    'border border-[var(--color-dim)] dark:border-[var(--color-dark-dim)] rounded-xl p-6 bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] backdrop-blur-sm';

  const getDynamicForm = async () => {
    try {
      const response = await fetchDynamicForm();
      if (response) {
        setForms(response);
      }
    } catch (error) {
      setError('Failed to load forms');
      setForms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDynamicForm();
  }, []);

  const fetchDynamicOptions = async (field: any, dependentValue: string) => {
    if (!field.dynamicOptions?.endpoint) return;

    setLoadingOptions((prev) => ({ ...prev, [field.id]: true }));

    try {
      const endpoint = `${field.dynamicOptions.endpoint}?${field.dynamicOptions.dependsOn}=${dependentValue}`;
      const response = await request<DynamicOptionsResponse>(endpoint);

      let options: string[] = [];
      if (field.id === 'state' && Array.isArray(response.states)) {
        options = response.states;
      } else if (Array.isArray(response)) {
        options = response;
      }

      setDynamicOptions((prev) => ({
        ...prev,
        [field.id]: options,
      }));
    } catch (error) {
      setDynamicOptions((prev) => ({
        ...prev,
        [field.id]: [],
      }));
    } finally {
      setLoadingOptions((prev) => ({ ...prev, [field.id]: false }));
    }
  };

  const clearDependentFields = (fieldId: string, fields: any[]) => {
    fields.forEach((field) => {
      if (field.dynamicOptions?.dependsOn === fieldId) {
        setFormValues((prev) => ({
          ...prev,
          [field.id]: '',
        }));
        setDynamicOptions((prev) => ({
          ...prev,
          [field.id]: [],
        }));
      }
      if (Array.isArray(field.fields)) {
        clearDependentFields(fieldId, field.fields);
      }
    });
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    if (!value && selectedForm) {
      clearDependentFields(fieldId, selectedForm.fields);
    }
  };

  useEffect(() => {
    setDynamicOptions({});
    setLoadingOptions({});
    setFormValues({});
  }, [selectedFormId]);

  useEffect(() => {
    const selectedForm = forms?.find((form) => form.formId === selectedFormId);
    if (!selectedForm) return;

    const processFields = (fields: any[]) => {
      fields.forEach((field) => {
        if (field.dynamicOptions) {
          const dependentFieldId = field.dynamicOptions.dependsOn;
          const dependentValue = formValues[dependentFieldId];
          const currentOptions = dynamicOptions[field.id] || [];

          if (
            dependentValue &&
            (currentOptions.length === 0 ||
              field.lastDependentValue !== dependentValue)
          ) {
            field.lastDependentValue = dependentValue;
            fetchDynamicOptions(field, dependentValue);
          }
        }
        if (Array.isArray(field.fields)) {
          processFields(field.fields);
        }
      });
    };

    if (Array.isArray(selectedForm.fields)) {
      processFields(selectedForm.fields);
    }
  }, [formValues, selectedFormId, forms]);

  const selectedForm = forms?.find((form) => form.formId === selectedFormId);

  const handleFormChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFormId(e.target.value);
    setFormValues({});
  };

  const isFieldVisible = (field: any) => {
    if (!field.visibility) return true;

    const dependentValue = formValues[field.visibility.dependsOn];
    return (
      field.visibility.condition === 'equals' &&
      dependentValue === field.visibility.value
    );
  };

  const getFieldOptions = (field: any): string[] => {
    if (field.dynamicOptions) {
      return dynamicOptions[field.id] || [];
    }
    return Array.isArray(field.options) ? field.options : [];
  };

  const renderField = (field: any) => {
    if (!isFieldVisible(field)) return null;

    const fieldContent = () => {
      switch (field.type) {
        case 'group':
          return (
            <fieldset className={groupClasses}>
              <legend className="px-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
                {field.label}
              </legend>
              <div className="space-y-4">
                {Array.isArray(field.fields) &&
                  field.fields.map((subField: any) => renderField(subField))}
              </div>
            </fieldset>
          );

        case 'text':
          return (
            <div className="mb-4">
              <label className={labelClasses} htmlFor={field.id}>
                {field.label}
                {field.required && <span className="ml-1 text-red-500">*</span>}
              </label>
              <input
                type="text"
                id={field.id}
                value={formValues[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className={`${baseInputClasses} border-gray-300 placeholder-gray-400 dark:border-gray-600 dark:placeholder-gray-500`}
                required={field.required}
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            </div>
          );

        case 'number':
          return (
            <div className="mb-4">
              <label className={labelClasses} htmlFor={field.id}>
                {field.label}
                {field.required && <span className="ml-1 text-red-500">*</span>}
              </label>
              <input
                type="number"
                id={field.id}
                value={formValues[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className={`${baseInputClasses} border-gray-300 dark:border-gray-600`}
                required={field.required}
                min={field.validation?.min}
                max={field.validation?.max}
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
              {(field.validation?.min !== undefined ||
                field.validation?.max !== undefined) && (
                <p className={helperTextClasses}>
                  {field.validation?.min !== undefined &&
                  field.validation?.max !== undefined
                    ? `Value must be between ${field.validation.min} and ${field.validation.max}`
                    : field.validation?.min !== undefined
                      ? `Minimum value: ${field.validation.min}`
                      : `Maximum value: ${field.validation.max}`}
                </p>
              )}
            </div>
          );

        case 'select':
          const options = getFieldOptions(field);
          const isLoading = loadingOptions[field.id];

          return (
            <div className="mb-4">
              <label className={labelClasses} htmlFor={field.id}>
                {field.label}
                {field.required && <span className="ml-1 text-red-500">*</span>}
                {field.dynamicOptions && (
                  <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    Dynamic
                  </span>
                )}
              </label>
              <div className="relative">
                <select
                  id={field.id}
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className={`${baseInputClasses} ${
                    isLoading ? 'opacity-50' : ''
                  } appearance-none border-gray-300 pr-10 dark:border-gray-600`}
                  required={field.required}
                  disabled={isLoading}
                >
                  <option value="">Select {field.label.toLowerCase()}</option>
                  {options.map((option: string) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
              {field.dynamicOptions && (
                <p className={helperTextClasses}>
                  Options depend on: {field.dynamicOptions.dependsOn}
                </p>
              )}
            </div>
          );

        case 'radio':
          return (
            <div className="mb-4">
              <label className={labelClasses}>
                {field.label}
                {field.required && <span className="ml-1 text-red-500">*</span>}
              </label>
              <div className="mt-2 space-y-2">
                {Array.isArray(field.options) &&
                  field.options.map((option: string) => (
                    <label
                      key={option}
                      className="flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      <input
                        type="radio"
                        name={field.id}
                        value={option}
                        checked={formValues[field.id] === option}
                        onChange={(e) =>
                          handleInputChange(field.id, e.target.value)
                        }
                        className="h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600"
                        required={field.required}
                      />
                      <span className="text-gray-700 dark:text-gray-200">
                        {option}
                      </span>
                    </label>
                  ))}
              </div>
            </div>
          );

        case 'checkbox':
          return (
            <div className="mb-4">
              <label className={labelClasses}>
                {field.label}
                {field.required && <span className="ml-1 text-red-500">*</span>}
              </label>
              <div className="mt-2 space-y-2">
                {Array.isArray(field.options) &&
                  field.options.map((option: string) => (
                    <label
                      key={option}
                      className="flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      <input
                        type="checkbox"
                        value={option}
                        checked={
                          Array.isArray(formValues[field.id]) &&
                          formValues[field.id].includes(option)
                        }
                        onChange={(e) => {
                          const currentValues = Array.isArray(
                            formValues[field.id]
                          )
                            ? formValues[field.id]
                            : [];
                          const newValues = e.target.checked
                            ? [...currentValues, option]
                            : currentValues.filter(
                                (value: string) => value !== option
                              );
                          handleInputChange(field.id, newValues);
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600"
                      />
                      <span className="text-gray-700 dark:text-gray-200">
                        {option}
                      </span>
                    </label>
                  ))}
              </div>
            </div>
          );

        case 'date':
          return (
            <div className="mb-4">
              <label className={labelClasses} htmlFor={field.id}>
                {field.label}
                {field.required && <span className="ml-1 text-red-500">*</span>}
              </label>
              <input
                type="date"
                id={field.id}
                value={formValues[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                className={`${baseInputClasses} border-gray-300 dark:border-gray-600`}
                required={field.required}
              />
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <motion.div
        key={field.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {fieldContent()}
      </motion.div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedForm) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      const formData = {
        formId: selectedForm.formId,
        title: selectedForm.title,
        fields: selectedForm.fields.map((field) => ({
          ...field,
          value: formValues[field.id],
        })),
      };

      await submitForm(formData);

      setFormValues({});
      setSelectedFormId('');
      setSubmitSuccess(true);

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Failed to submit form'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-bright)] border-t-transparent dark:border-[var(--color-dark-bright)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="inline-flex items-center rounded-lg bg-[var(--color-background)] px-4 py-2 dark:bg-[var(--color-dark-background)]">
          <svg
            className="mr-2 h-5 w-5 text-[var(--color-bright)] dark:text-[var(--color-dark-bright)]"
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
          <span className="text-[var(--color-bright)] dark:text-[var(--color-dark-bright)]">
            {error}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {submitSuccess && (
        <div className="mb-6 rounded-lg bg-green-100 p-4 text-green-800 dark:bg-green-900/50 dark:text-green-300">
          <div className="flex items-center">
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Application submitted successfully!
          </div>
        </div>
      )}

      {submitError && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900/50 dark:text-red-300">
          <div className="flex items-center">
            <svg
              className="mr-2 h-5 w-5"
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
            {submitError}
          </div>
        </div>
      )}

      <div className="mb-8">
        <label
          className="mb-2 block text-lg font-medium text-[var(--color-dark-forground)] dark:text-[var(--color-forground)]"
          htmlFor="formSelect"
        >
          Select Insurance Type
        </label>
        <div className="relative">
          <select
            id="formSelect"
            value={selectedFormId}
            onChange={handleFormChange}
            className={`${baseInputClasses} appearance-none border-[var(--color-dim)] pr-10 dark:border-[var(--color-dark-dim)]`}
          >
            <option value="">Choose the type of insurance</option>
            {Array.isArray(forms) &&
              forms.map((form) => (
                <option key={form.formId} value={form.formId}>
                  {form.title}
                </option>
              ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-5 w-5 text-[var(--color-dim)] dark:text-[var(--color-dark-dim)]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {selectedForm && (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6 rounded-2xl border border-[var(--color-dim)] bg-[var(--color-forground)] p-8 shadow-sm dark:border-[var(--color-dark-dim)] dark:bg-[var(--color-dark-forground)]">
            {Array.isArray(selectedForm.fields) &&
              selectedForm.fields.map((field) => (
                <AnimatePresence key={field.id} mode="sync">
                  {renderField(field)}
                </AnimatePresence>
              ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="flex justify-end"
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[var(--color-bright)] px-6 py-3 text-sm font-medium text-[var(--color-forground)] shadow-sm transition-colors duration-200 hover:opacity-90 focus:ring-2 focus:ring-[var(--color-bright)] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[var(--color-dark-bright)] dark:text-[var(--color-dark-forground)] dark:focus:ring-[var(--color-dark-bright)]"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-forground)] border-t-transparent dark:border-[var(--color-dark-forground)]"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Application'
              )}
            </button>
          </motion.div>
        </form>
      )}
    </div>
  );
}
