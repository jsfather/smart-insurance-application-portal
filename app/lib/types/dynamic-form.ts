export interface DynamicForm {
  formId: string;
  title: string;
  fields: FormField[];
}

interface FormField {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  fields?: FormField[];
  dynamicOptions?: {
    dependsOn: string;
    endpoint: string;
    method: string;
  };
  visibility?: {
    dependsOn: string;
    condition: string;
    value: string;
  };
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}
