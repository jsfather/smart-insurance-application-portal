import request from '@/app/lib/api/client';
import { DynamicForm } from '@/app/lib/types/dynamic-form';

export const fetchDynamicForm = async () => {
  const response = await request<DynamicForm>('insurance/forms');

  if (!response) {
    throw new Error('خطایی در دریافت لیست بلاگ‌ها رخ داده است');
  }

  return response;
};
