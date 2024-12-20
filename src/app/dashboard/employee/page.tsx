'use client';

import React, { useCallback, useRef, useState } from "react";
import type { CellValueChangedEvent, ColDef, ColGroupDef, GridReadyEvent, ValueFormatterParams } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import { listAllTags } from "@/services/tagService";
import { listAllRoles } from "@/services/roleService";
import { DeleteButton, NewButton, SaveButton } from "@/components/ui/datatable/button";
import { axiosHelper } from "@/lib/axios";

ModuleRegistry.registerModules([AllCommunityModule]);

interface IRowData {
  _id: string,
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
  modified?: boolean;
}

interface ServerResponse {
  total: number;
  skip: number;
  limit: number;
  items: IRowData[];
}

interface CustomButtonParams extends CustomCellRendererProps {
  onSave: (obj_id: string, obj: IRowData) => void;
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
  const gridRef = useRef<AgGridReact>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [rowData, setRowData] = useState<IRowData[]>();
  const [newRowFormData, setNewRowFormData] = useState<IRowData>({
    _id: "",
    username: "",
    m_nr: 0,
    role: "",
    department: "",
    employment_start_date: "",
    employment_end_date: "",
    salary_type: "",
    hourly_rate: 0,
    salary: 0,
    hours_worked: 0,
    bonus: 0,
    deduction: 0,
    tags: [],
  })

  // UI Functions
  const onClickNewRow = async () => {
    setNewRowFormData({
      _id: "",
      username: "",
      m_nr: 0,
      role: "",
      department: "",
      employment_start_date: "",
      employment_end_date: "",
      salary_type: "",
      hourly_rate: 0,
      salary: 0,
      hours_worked: 0,
      bonus: 0,
      deduction: 0,
      tags: [],
    });
    dialogRef.current?.showModal();
  }

  const onChangeValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(newRowFormData, name, value);
    setNewRowFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // CRUD Functions
  const onCreate = async () => {
    if (newRowFormData.username === "") {
      alert("Username is empty");
      return;
    }
    await axiosHelper.post<IRowData, any>(`/employee`, newRowFormData);
    await fetchRowData();
    dialogRef.current?.close();
  }

  const fetchRowData = async () => {
    const resp = await axiosHelper.get<ServerResponse>("/employee");
    setRowData(resp?.items);
  }

  const onSave = async (obj_id: string, obj: IRowData) => {
    await axiosHelper.put<IRowData>(`/employee/${obj_id}`, obj, "Are you sure want to save?");
    obj.modified = false;
    gridRef.current?.api.redrawRows();
  }

  const onDelete = async (obj_id: string) => {
    await axiosHelper.delete(`/employee/${obj_id}`, "Are you sure want to delete?");
    const newRowData: IRowData[] = [];
    gridRef.current?.api.forEachNode((node) => {
      if (node.data._id !== obj_id) {
        newRowData.push(node.data);
      }
    });
    setRowData(newRowData);
  }

  // Table functions
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
          <SaveButton onClick={() => params.onSave(params.data._id, params.data)} />
          <DeleteButton onClick={() => params.onDelete(params.data._id)} />
        </div>
      ),
      cellRendererParams: {
        onSave: onSave,
        onDelete: onDelete,
      },
    },
  ]);

  const defaultColDef: ColDef = {
    filter: true,
    editable: true,
  };

  const onGridReady = useCallback(async (params: GridReadyEvent) => {
    await fetchRowData();
  }, []);

  const onCellValueChanged = (event: CellValueChangedEvent) => {
    event.data.modified = true;
    gridRef.current?.api.redrawRows();
    console.log(`row changed: ${JSON.stringify(event.data)}`);
  };

  return (
    <div>
      <div className="flex justify-between px-2 py-4">
        <p className="text-lg font-medium text-gray-700">
          Employee
        </p>
        <NewButton onClick={() => onClickNewRow()}>New Employee</NewButton>
        <dialog ref={dialogRef} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg p-2 mb-8 border-b">Add New Employee</h3>
            <div className="flex flex-col gap-y-4">
              <label className="input input-sm input-bordered flex items-center gap-2">
                Username:
                <input type="text" name="username" className="grow" placeholder="John Doe" value={newRowFormData.username} onChange={onChangeValues} />
              </label>
              <label className="input input-sm input-bordered flex items-center gap-2">
                M-Nr:
                <input type="number" name="m_nr" className="grow" placeholder="1001" value={newRowFormData.m_nr} onChange={onChangeValues} />
              </label>
            </div>
            <div className="modal-action">
              <button className="btn btn-primary btn-sm" onClick={() => onCreate()}>Add</button>
              <form method="dialog">
                <button className="btn btn-sm">Cancel</button>
              </form>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
      <div className="overflow-auto">
        <div className="h-[calc(100vh-10.6rem)] min-w-[600px] min-h-[450px]">
          <AgGridReact
            ref={gridRef}
            columnDefs={colDefs}
            rowData={rowData}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onCellValueChanged={onCellValueChanged}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 25, 50]}
          />
        </div>
      </div>
    </div>
  );
};
