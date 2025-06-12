export interface TableData {
    columns: string[];
    data: TableRow[];
  }
  
  interface TableRow {
    id: string;
    "Full Name": string;
    Age: number;
    "Insurance Type": string;
    City: string;
    Status: string;
  }
  