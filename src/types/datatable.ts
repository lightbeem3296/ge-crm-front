import { CustomCellRendererProps } from "ag-grid-react";

export interface ActionCellRenderParams<TRowData> extends CustomCellRendererProps {
  onSave: (obj: TRowData) => void;
  onDelete: (obj: TRowData) => void;
}

export interface EmployeeRowData {
  _id?: string,

  username: string;
  m_nr: number;
  role: string;
  department: string;
  employment_start_date: string;
  employment_end_date: string;
  salary_type: string;
  hourly_rate: number;
  salary: number;
  hours_worked: number;
  bonus: number;
  deduction: number;
  tags: string[];

  _is_modified?: boolean;
  _is_created?: boolean;
}
