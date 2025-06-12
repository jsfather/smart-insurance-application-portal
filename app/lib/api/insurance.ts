import request from '@/app/lib/api/client';
import { DynamicForm } from '@/app/lib/types/dynamic-form';
import { Submission } from '@/app/lib/types/submissions';

export const fetchDynamicForm = async () => {
  const response = await request<DynamicForm[]>('/api/insurance/forms');

  if (!response) {
    throw new Error('خطایی در دریافت لیست فرم های بیمه رخ داده است');
  }

  return response;
};

export const submitForm = async (data: Partial<DynamicForm>) => {
  const response = await request<DynamicForm>('/api/insurance/forms/submit', {
    method: 'POST',
    body: JSON.stringify(data),
  });

  if (!response) {
    throw new Error('خطایی در ثبت درخواست بیمه رخ داده است');
  }

  return response;
};

export const fetchInsuranceSubmissions = async () => {
  const response = await request<{ data: Submission }>(
    '/api/insurance/forms/submissions'
  );

  if (!response) {
    throw new Error('خطایی در دریافت لیست درخواست های بیمه رخ داده است');
  }

  return response;
};
