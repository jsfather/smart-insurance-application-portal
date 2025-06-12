import DynamicForm from '@/app/components/forms/DynamicForm';

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] dark:bg-[var(--color-dark-background)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-dark-forground)] dark:text-[var(--color-forground)] mb-8 sm:mb-12">
          Insurance Application
        </h1>
        <DynamicForm />
      </div>
    </div>
  );
} 