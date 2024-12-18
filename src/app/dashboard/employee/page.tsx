'use client';

import React, { useCallback, useRef, useState } from "react";
import type { ColDef, ColGroupDef, GridReadyEvent, ValueFormatterParams } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry, themeBalham } from "ag-grid-community";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import axios from "axios";
import { listAllTags } from "@/services/tagService";
import { listAllRoles } from "@/services/roleService";
import { DeleteButton, SaveButton } from "@/components/ui/datatable/button";

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
  tags: string[];
}

interface ServerResponse {
  total: number;
  skip: number;
  limit: number;
  items: IRowData[];
}

interface CustomButtonParams extends CustomCellRendererProps {
  onUpdate: (obj_id: string) => void;
  onDelete: (obj_id: string) => void;
}

const roleMappings = await listAllRoles();

function extractKeys(mappings: { [key: string]: { role_name: string, description: string } }) {
  return Object.keys(mappings);
}

function lookupValue(mappings: { [key: string]: { role_name: string, description: string } }, key: string) {
  return mappings[key].role_name;
}

const roleCodes = extractKeys(roleMappings);


// Custom Cell Renderer to display tags
const TagsRenderer = (props: any) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
      {props.value.map((tag: string, index: number) => (
        <span
          key={index}
          style={{
            backgroundColor: "#e2e8f0",
            color: "#1a202c",
            padding: "2px",
            borderRadius: "5px",
            fontSize: "12px",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

// Custom Cell Editor to add/edit tags
const TagsEditor = (props: any) => {
  const [tags, setTags] = useState<string[]>(props.value || []);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputRef.current) {
      const newTag = inputRef.current.value.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      inputRef.current.value = "";
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const stopEditing = () => {
    props.stopEditing();
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "5px",
        alignItems: "center",
        padding: "2px",
      }}
      onBlur={stopEditing}
    >
      {tags.map((tag, index) => (
        <span
          key={index}
          style={{
            backgroundColor: "#e2e8f0",
            color: "#1a202c",
            padding: "2px",
            borderRadius: "2px",
            fontSize: "12px",
            cursor: "pointer",
          }}
          onClick={() => removeTag(tag)}
        >
          {tag} ✕
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        style={{ flex: "1", border: "none", outline: "none" }}
        placeholder="Add tag..."
        onKeyDown={addTag}
      />
    </div>
  );
};

export default function EmployeePage() {
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
      width: 160,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: roleCodes,
      },
      filterParams: {
        valueFormatter: (params: ValueFormatterParams) => {
          return lookupValue(roleMappings, params.value);
        },
      },
      valueFormatter: (params) => {
        return lookupValue(roleMappings, params.value)
      },
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
          width: 100,
          cellDataType: "dateString",
          valueFormatter: (params) => {
            return params.value.split("T")[0];
          }
        },
        {
          headerName: "End Date",
          field: "employment_end_date",
          width: 100,
          cellDataType: "dateString",
          valueFormatter: (params) => {
            return params.value.split("T")[0];
          }
        },
      ],
    },
    {
      headerName: "Salary Type",
      field: "salary_type",
      width: 120,
    },
    {
      headerName: "Hourly Rate",
      field: "hourly_rate",
      width: 110,
    },
    {
      headerName: "Salary",
      field: "salary",
      width: 80,
    },
    {
      headerName: "Hours Worked",
      field: "hours_worked",
      width: 120,
    },
    {
      headerName: "Bonus",
      field: "bonus",
      width: 80,
    },
    {
      headerName: "Deduction",
      field: "deduction",
      width: 100,
    },
    {
      headerName: "Tags",
      field: "tags",
      width: 400,
      cellRenderer: TagsRenderer,
      cellEditor: TagsEditor,
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 120,
      pinned: "right",
      filter: false,
      editable: false,
      cellRenderer: (params: CustomButtonParams) => (
        <div className="h-full flex items-center gap-1">
          <SaveButton onClick={() => params.onUpdate(params.data._id)} />
          <DeleteButton onClick={() => params.onDelete(params.data._id)} />
        </div>
      ),
      cellRendererParams: {
        onUpdate: onUpdate,
        onDelete: onDelete,
      },
    },
  ]);

  const defaultColDef: ColDef = {
    filter: true,
    editable: true,
  };

  const fetchRowData = async () => {
    try {
      const response = await axios.get<ServerResponse>(
        'http://localhost:8000/api/employee',
      );
      setRowData(response.data.items);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const onGridReady = useCallback(async (params: GridReadyEvent) => {
    await fetchRowData();
  }, []);

  return (
    <div>
      <div className="text-lg font-medium px-2 py-4">Employee</div>
      <div className="h-[calc(100vh-10.6rem)] min-h-[450px] min-w-[800px]">
        <AgGridReact
          columnDefs={colDefs}
          rowData={rowData}
          theme={themeBalham}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
        />
      </div>
    </div>
  );
};
