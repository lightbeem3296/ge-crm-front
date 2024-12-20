'use client';

import React, { useCallback, useRef, useState } from "react";
import type { CellValueChangedEvent, ColDef, ColGroupDef, GridReadyEvent, RowValueChangedEvent, ValueFormatterParams } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import { getTagMappings } from "@/services/tagService";
import { getRoleMappings } from "@/services/roleService";
import { DeleteButton, NewButton, SaveButton } from "@/components/ui/datatable/button";
import { axiosHelper } from "@/lib/axios";
import { getSalaryTypeMappings } from "@/services/salaryTypeService";

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

  _is_modified?: boolean;
  _is_created?: boolean;
}

interface ServerResponse {
  total: number;
  skip: number;
  limit: number;
  items: IRowData[];
}

interface ActionCellRenderParams extends CustomCellRendererProps {
  onSave: (obj_id: string, obj: IRowData) => void;
  onDelete: (obj_id: string) => void;
}

function extractKeys(mappings: Record<string, string>) {
  return Object.keys(mappings);
}

function lookupValue(mappings: Record<string, string>, key: string) {
  return mappings[key];
}

var roleMappings = await getRoleMappings();
var roleCodes = extractKeys(roleMappings);

var salaryTypeMappings = await getSalaryTypeMappings();
var salaryTypeCodes = extractKeys(salaryTypeMappings);

var tagMappings = await getTagMappings();

const TagsRenderer = (props: any) => {
  return (
    <div className="flex flex-wrap overflow-auto gap-1 items-center h-full">
      {props.value.map((tag: string, index: number) => (
        <span
          key={index}
          className="bg-gray-200 text-xs py-1 px-3 border border-gray-300 rounded-full text-gray-800 font-medium"
        >
          {lookupValue(tagMappings, tag)}
        </span>
      ))}
    </div>
  );
};

const TagsEditor = (props: any) => {
  const [tags, setTags] = useState<string[]>(props.value || []);

  const removeTag = (tag: string) => {
    const updatedTags = tags.filter((t) => t !== tag);
    props.onValueChange(updatedTags);
    setTags(updatedTags);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTag = event.target.value;
    if (newTag && !tags.includes(newTag)) {
      const updatedTags = [...tags, newTag]
      props.onValueChange(updatedTags);
      setTags(updatedTags);
    }
  };

  return (
    <div className="flex flex-wrap overflow-auto gap-1 items-center h-full">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="flex gap-x-1 bg-gray-200 py-1 pl-3 pr-1 border border-gray-300 rounded-full text-xs text-gray-800 font-medium"
        >
          <span>
            {lookupValue(tagMappings, tag)}
          </span>
          <button
            onClick={() => removeTag(tag)}
            className="flex items-center justify-center rounded-full size-4 bg-gray-300 border border-gray-400 cursor-pointer"
          >
            ✕
          </button>
        </span>
      ))}
      <select
        className="select select-sm select-bordered text-xs text-gray-800"
        onChange={handleSelectChange}
        value=""
      >
        <option disabled value="">Select a tag to add ...</option>
        {Object.entries(tagMappings).map(([key, value], index) => (
          tags?.includes(key) ? null : <option key={index} value={key}>{value}</option>
        ))}
      </select>
    </div>
  );
};

export default function EmployeePage() {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<IRowData[]>();

  // UI Functions
  const onClickNewRow = async () => {
    const newRow: IRowData = {
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
      _is_created: true,
    };
    setRowData(rowData ? [newRow, ...rowData] : [newRow]);
    setTimeout(() => {
      gridRef.current?.api.paginationGoToPage(0);
      gridRef.current?.api.setGridOption("editType", "fullRow");
      gridRef.current?.api.startEditingCell({
        rowIndex: 0,
        colKey: "username",
      });
    }, 0);
  }

  // CRUD Functions
  const fetchRowData = async () => {
    const resp = await axiosHelper.get<ServerResponse>("/employee");
    setRowData(resp?.items);
  }

  const onSave = async (obj_id: string, obj: IRowData) => {
    if (obj._is_modified === true) {
      await axiosHelper.put<IRowData>(`/employee/${obj_id}`, obj, "Are you sure want to save?");
      obj._is_modified = false;
    }
    if (obj._is_created === true) {
      await axiosHelper.post<IRowData, any>(`/employee/${obj_id}`, obj);
      obj._is_modified = false;
      obj._is_created = false;
    }
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
      width: 140,
    },
    {
      headerName: "M-Nr",
      field: "m_nr",
      width: 100,
    },
    {
      headerName: "Role",
      field: "role",
      width: 180,
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
      width: 180,
    },
    {
      headerName: "Employment Date",
      children: [
        {
          headerName: "Start Date",
          field: "employment_start_date",
          width: 130,
          cellDataType: "dateString",
          valueFormatter: (params) => {
            return params.value.split("T")[0];
          }
        },
        {
          headerName: "End Date",
          field: "employment_end_date",
          width: 130,
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
      width: 160,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: salaryTypeCodes,
      },
      filterParams: {
        valueFormatter: (params: ValueFormatterParams) => {
          return lookupValue(salaryTypeMappings, params.value);
        },
      },
      valueFormatter: (params) => {
        return lookupValue(salaryTypeMappings, params.value)
      },
    },
    {
      headerName: "Hourly Rate",
      field: "hourly_rate",
      width: 140,
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
      width: 100,
    },
    {
      headerName: "Deduction",
      field: "deduction",
      width: 120,
    },
    {
      headerName: "Tags",
      field: "tags",
      width: 600,
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
      cellRenderer: (params: ActionCellRenderParams) => (
        <div className="h-full flex items-center gap-1">
          <SaveButton disabled={
            (params.data._is_modified === true || params.data._is_created)
              ? false
              : true}
            onClick={() => params.onSave(params.data._id, params.data)}
          />
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
  };

  const onRowValueChanged = (event: RowValueChangedEvent) => {
    gridRef.current?.api.setGridOption("editType", undefined);
  }

  return (
    <div>
      <div className="flex justify-between px-2 py-4">
        <p className="text-lg font-medium text-gray-700">
          Employee
        </p>
        <NewButton onClick={() => onClickNewRow()}>New Employee</NewButton>
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
            onRowValueChanged={onRowValueChanged}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 25, 50]}
          />
        </div>
      </div>
    </div>
  );
};
