'use client';

import React, { useCallback, useMemo, useRef, useState } from "react";
import type { CellValueChangedEvent, ColDef, ColGroupDef, GridReadyEvent, Theme, ValueFormatterParams, ValueGetterParams } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { getTagMappings } from "@/services/tagService";
import { getRoleMappings } from "@/services/roleService";
import { DeleteButton, NewButton, SaveButton } from "@/components/ui/datatable/button";
import { axiosHelper } from "@/lib/axios";
import { getSalaryTypeMappings } from "@/services/salaryTypeService";
import { EmployeeRowData } from "@/types/datatable";
import { ApiGeneralResponse, ApiListResponse } from "@/types/api";
import { ActionCellRenderParams } from "@/types/datatable";
import { extractKeys, lookupValue } from "@/utils/record";
import { myTheme } from "@/components/ui/theme/agGrid";
import { customAlert, CustomAlertType } from "@/components/ui/alert";
import { SetTableFilterRequest } from "@/types/user";
import { loadCurrentUser } from "@/services/authService";

ModuleRegistry.registerModules([AllCommunityModule]);

const roleMappings = await getRoleMappings();
const salaryTypeMappings = await getSalaryTypeMappings();
const tagMappings = await getTagMappings();

export default function EmployeePage() {
  const currentUser = loadCurrentUser();
  const gridRef = useRef<AgGridReact>(null);
  const [rowDataList, setRowDataList] = useState<EmployeeRowData[]>();

  // Custom Components
  const TagsRenderer = (props: any) => { // eslint-disable-line
    return (
      <div className="flex overflow-hidden gap-1 items-center h-full">
        {props.value.map((tag: string, index: number) => (
          <span
            key={index}
            className="bg-base-200 text-xs py-1 px-3 border border-base-content/30 rounded-full text-base-content font-medium"
          >
            {lookupValue(tagMappings, tag)}
          </span>
        ))}
      </div>
    );
  };

  const TagsEditor = (props: any) => { // eslint-disable-line
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
      <div className="flex flex-wrap overflow-auto gap-1 items-center fixed h-fit bg-base-100 border border-base-content/30 rounded-sm px-2 py-[0.18rem] my-auto">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex gap-x-1 bg-base-200 py-1 pl-3 pr-1 border border-base-content/30 rounded-full text-xs text-base-content font-medium"
          >
            <span>
              {lookupValue(tagMappings, tag)}
            </span>
            <button
              onClick={() => removeTag(tag)}
              className="flex items-center justify-center rounded-full size-4 bg-base-200 border border-base-content/30 cursor-pointer"
            >
              ✕
            </button>
          </span>
        ))}
        <select
          className="select select-sm select-bordered bg-base-200 text-xs text-base-content"
          onChange={handleSelectChange}
          value=""
        >
          <option disabled value="">Select a tag to add ...</option>
          {extractKeys(tagMappings).map((key) => (
            tags?.includes(key) ? null : <option key={key} value={key}>{lookupValue(tagMappings, key)}</option>
          ))}
        </select>
      </div>
    );
  };

  // UI Functions
  const onClickNewRow = async () => {
    const rowData: EmployeeRowData = {
      username: "",
      m_nr: 0,
      role: "",
      department: "",
      employment_start_date: "",
      employment_end_date: "",
      salary_type: "",
      hourly_rate: 0,
      hours_worked: 0,
      points_earned: 0,
      salary: 0,
      bonus: 0,
      deduction: 0,
      tags: [],

      _is_modified: true,
      _is_created: true,
    };
    setRowDataList(rowDataList ? [rowData, ...rowDataList] : [rowData]);
    setTimeout(() => {
      gridRef.current?.api.paginationGoToPage(0);
      gridRef.current?.api.startEditingCell({
        rowIndex: 0,
        colKey: "username",
      });
    }, 0);
  }

  // CRUD Functions
  const fetchRowData = async () => {
    const response = await axiosHelper.get<ApiListResponse<EmployeeRowData>>("/employee/list");
    setRowDataList(response?.items);
  }

  const onSave = async (obj: EmployeeRowData) => {
    if (obj._is_created) {
      const response = await axiosHelper.post<EmployeeRowData, ApiGeneralResponse>(`/employee/create`, obj, undefined);
      if (response) {
        obj._id = response.detail.object_id
        obj._is_modified = false;
        obj._is_created = false;

        customAlert({
          type: CustomAlertType.SUCCESS,
          message: "Created successfully.",
        });
      }
    } else if (obj._is_modified) {
      const response = await axiosHelper.put<EmployeeRowData, ApiGeneralResponse>(`/employee/update/${obj._id}`, obj);
      if (response) {
        obj._is_modified = false;

        customAlert({
          type: CustomAlertType.SUCCESS,
          message: "Updated successfully.",
        });
      }
    }
    gridRef.current?.api.redrawRows();
  }

  const onDelete = async (obj: EmployeeRowData) => {
    let needRedraw = true;
    if (!obj._is_created) {
      const response = await axiosHelper.delete<ApiGeneralResponse>(`/employee/delete/${obj._id}`);
      if (response) {
        customAlert({
          type: CustomAlertType.SUCCESS,
          message: "Deleted successfully.",
        });
      } else {
        needRedraw = false;
      }
    }
    if (needRedraw) {
      const newRowData: EmployeeRowData[] = [];
      gridRef.current?.api.forEachNode((node) => {
        if (node.data._id !== obj._id) {
          newRowData.push(node.data);
        }
      });
      setRowDataList(newRowData);
    }
  }

  const onFilterChanged = () => {
    const filterModel = gridRef.current?.api.getFilterModel();
    if (filterModel) {
      const filter = JSON.stringify(filterModel);
      axiosHelper.post<SetTableFilterRequest, ApiGeneralResponse>(`/user/set-filter/employee`, {
        filter: filter,
      });
    }
  }

  // Table functions
  const [colDefs, setColDefs] = useState<(ColDef | ColGroupDef)[]>([ // eslint-disable-line
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
        values: extractKeys(roleMappings),
      },
      valueGetter: (params: ValueGetterParams) => {
        return lookupValue(roleMappings, params.data.role) || params.data.role;
      },
      valueFormatter: (params: ValueFormatterParams) => {
        return lookupValue(roleMappings, params.value) || params.value;
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
            return params.value ? params.value.split("T")[0] : "";
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
        values: extractKeys(salaryTypeMappings),
      },
      valueGetter: (params: ValueGetterParams) => {
        return lookupValue(salaryTypeMappings, params.data.salary_type);
      },
      valueFormatter: (params: ValueFormatterParams) => {
        return lookupValue(salaryTypeMappings, params.value) || params.value;
      },
    },
    {
      headerName: "Hourly Rate",
      field: "hourly_rate",
      width: 140,
    },
    {
      headerName: "Hours Worked",
      field: "hours_worked",
      width: 150,
    },
    {
      headerName: "Points Earned",
      field: "points_earned",
      width: 150,
    },
    {
      headerName: "Salary",
      field: "salary",
      width: 100,
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
      width: 400,
      cellRenderer: TagsRenderer,
      cellEditor: TagsEditor,
      valueFormatter: (params: ValueFormatterParams) => {
        let str = "";
        params.value.map((tag_id: string) => {
          str += "\n" + lookupValue(tagMappings, tag_id);
        });
        return str;
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 120,
      pinned: "right",
      filter: false,
      editable: false,
      sortable: false,
      cellRenderer: (params: ActionCellRenderParams<EmployeeRowData>) => (
        <div className="h-full flex items-center gap-1">
          <SaveButton disabled={
            (params.data._is_modified || params.data._is_created)
              ? false
              : true}
            onClick={() => params.onSave ? params.onSave(params.data) : alert("click")}
          />
          <DeleteButton onClick={() => params.onDelete ? params.onDelete(params.data) : alert("click")} />
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

  const onGridReady = useCallback(async (params: GridReadyEvent) => { // eslint-disable-line
    await fetchRowData();
    if (currentUser?.employee_filter) {
      try {
        const filter = JSON.parse(currentUser?.employee_filter);
        gridRef.current?.api.setFilterModel(filter);
      } catch {
        gridRef.current?.api.setFilterModel({});
      }
    }
  }, []); // eslint-disable-line

  const onCellValueChanged = (event: CellValueChangedEvent) => {
    event.data._is_modified = true;
    gridRef.current?.api.redrawRows();
  };

  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme();
  }, []);

  return (
    <div>
      <div className="flex justify-between px-2 py-4">
        <p className="text-lg font-medium text-base-content/80">
          Employee
        </p>
        <NewButton onClick={() => onClickNewRow()}>New Employee</NewButton>
      </div>
      <div className="overflow-auto">
        <div className="h-[calc(100vh-10.6rem)] min-w-[600px] min-h-[450px]">
          <AgGridReact
            ref={gridRef}
            columnDefs={colDefs}
            rowData={rowDataList}
            theme={theme}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onCellValueChanged={onCellValueChanged}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 25, 50]}
            onFilterChanged={() => onFilterChanged()}
          />
        </div>
      </div>
    </div>
  );
};
