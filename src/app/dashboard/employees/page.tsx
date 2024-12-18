'use client';

import React, { useCallback, useState } from "react";
import type { ColDef, ColGroupDef, GridReadyEvent } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import axios from "axios";
import { listTags as listAllTags } from "@/services/tagService";
import { listRoles as listAllRoles } from "@/services/roleService";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTrash } from "@fortawesome/free-solid-svg-icons";


ModuleRegistry.registerModules([AllCommunityModule]);


interface IRowData {
  _id: string,
  username: string;
  m_nr: number;
  role: string;
  department: boolean;
  employment_start_date: string;
  employment_end_date: string;
  salary_type: string;
  hourly_rate: number;
  salary: number;
  hours_worked: number;
  bonus: number;
  deduction: number;
  tags: string;
}

interface RowData {
  _id: string,
  username: string;
  m_nr: number;
  role: string;
  department: boolean;
  employment_start_date: string;
  employment_end_date: string;
  salary_type: string;
  hourly_rate: number;
  salary: number;
  hours_worked: number;
  bonus: number;
  deduction: number;
  tags: string[];
}

// Define the server response type
interface ServerResponse {
  total: number;
  skip: number;
  limit: number;
  items: RowData[];
}

interface CustomButtonParams extends CustomCellRendererProps {
  onUpdate: (obj_id: string) => void;
  onDelete: (obj_id: string) => void;
}

export default function EmployeesPage() {
  const [rowData, setRowData] = useState<IRowData[]>();

  const onUpdate = async (obj_id: string) => {
    alert("update: " + obj_id);
  }

  const onDelete = async (obj_id: string) => {
    try {
      const isConfirmed = confirm("Are you sure you want to delete?");
      if (!isConfirmed) return;

      await axios.delete(`http://localhost:8000/api/employee/${obj_id}`);
      await fetchRowData();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        alert("Failed to delete employee: " + error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  }

  const [colDefs, setColDefs] = useState<(ColDef | ColGroupDef)[]>([
    {
      headerName: "Name",
      field: "username",
      width: 120,
    },
    {
      headerName: "M-Nr",
      field: "m_nr",
      width: 80,
    },
    {
      headerName: "Role",
      field: "role",
      width: 200,
    },
    {
      headerName: "Department",
      field: "department",
      width: 160,
    },
    {
      headerName: "Employment Date",
      children: [
        {
          headerName: "Start Date",
          field: "employment_start_date",
          width: 200,
          cellDataType: "dateString",
        },
        {
          headerName: "End Date",
          field: "employment_end_date",
          width: 200,
        },
      ],
    },
    {
      headerName: "Salary Type",
      field: "salary_type",
      width: 160,
    },
    {
      headerName: "Hourly Rate",
      field: "hourly_rate",
      width: 120,
    },
    {
      headerName: "Salary",
      field: "salary",
      width: 100,
    },
    {
      headerName: "Hours Worked",
      field: "hours_worked",
      width: 150,
    },
    {
      headerName: "Bonus",
      field: "bonus",
      width: 80,
    },
    {
      headerName: "Deduction",
      field: "deduction",
      width: 120,
    },
    {
      headerName: "Tags",
      field: "tags",
      width: 300,
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 120,
      pinned: "right",
      filter: false,
      editable: false,
      cellRenderer: (params: CustomButtonParams) => (
        <div className="h-full flex items-center">
          <button
            type="button"
            className="px-3 py-1 w-fit hover:bg-blue-600/10 border border-transparent hover:border-blue-600/20 rounded-md text-sm duration-300"
            onClick={() => params.onUpdate(params.data._id)}
          >
            <FontAwesomeIcon icon={faSave} className="text-blue-600" />
          </button>
          <button
            type="button"
            className="px-3 py-1 w-fit hover:bg-red-600/10 border border-transparent hover:border-red-600/20 rounded-md text-sm duration-300"
            onClick={() => params.onDelete(params.data._id)}
          >
            <FontAwesomeIcon icon={faTrash} className="text-red-600" />
          </button>
        </div>
      ),
      cellRendererParams: {
        onUpdate: onUpdate,
        onDelete: onDelete,
      },
    },
  ]);

  const defaultColDef: ColDef = {
    minWidth: 100,
    filter: true,
    floatingFilter: true,
    editable: true,
  };


  const fetchRowData = async () => {
    try {
      const all_tags = await listAllTags();
      const all_roles = await listAllRoles();

      const response = await axios.get<ServerResponse>(
        'http://localhost:8000/api/employee',
      );
      const items: IRowData[] = [];
      response.data.items.forEach(element => {
        let tags: string = "";
        element.tags.forEach((tag_id, i) => {
          if (i === 0) {
            tags = all_tags[tag_id].tag_name;
          } else {
            tags += ", " + all_tags[tag_id].tag_name;
          }
        });
        items.push({
          _id: element._id,
          username: element.username,
          m_nr: element.m_nr,
          role: all_roles[element.role].role_name,
          department: element.department,
          employment_start_date: element.employment_start_date.split("T")[0],
          employment_end_date: element.employment_end_date.split("T")[0],
          salary_type: element.salary_type,
          hourly_rate: element.hourly_rate,
          salary: element.salary,
          hours_worked: element.hours_worked,
          bonus: element.bonus,
          deduction: element.deduction,
          tags: tags,
        });
      });
      setRowData(items);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const onGridReady = useCallback(async (params: GridReadyEvent) => {
    await fetchRowData();
  }, []);


  return (
    <div>
      <div className="text-lg font-medium px-2 py-4">Employees</div>
      <div className="h-[calc(100vh-10.6rem)] min-h-[450px] min-w-[800px]">
        <AgGridReact
          columnDefs={colDefs}
          rowData={rowData}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady} // Callback for grid ready
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
        />
      </div>
    </div>
  );
};
