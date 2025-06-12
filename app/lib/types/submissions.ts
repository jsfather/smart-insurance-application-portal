export interface Submission {
  id: string;
  'Full Name': string;
  Age: number;
  Gender: string;
  'Insurance Type': string;
  City: string;
}

export interface TableData {
  columns: string[];
  data: Submission[];
} 