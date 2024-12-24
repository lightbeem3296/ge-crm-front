'use client';

import React, { useCallback, useRef, useState } from "react";
import type { CellValueChangedEvent, ColDef, ColGroupDef, GridReadyEvent } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { DeleteButton, NewButton, SaveButton } from "@/components/ui/datatable/button";
import { axiosHelper } from "@/lib/axios";
import { ActionCellRenderParams, SalaryTypeRowData } from "@/types/datatable";
import { ApiCrudResponse, ApiListResponse } from "@/types/api";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function SalaryTypePage() {
  const gridRef = useRef<AgGridReact>(null);
  const [rowDataList, setRowDataList] = useState<SalaryTypeRowData[]>();

  // UI Functions
  const onClickNewRow = async () => {
    const rowData: SalaryTypeRowData = {
      salary_type_name: "",
      description: "",

      _is_modified: true,
      _is_created: true,
    };
    setRowDataList(rowDataList ? [rowData, ...rowDataList] : [rowData]);
    setTimeout(() => {
      gridRef.current?.api.paginationGoToPage(0);
      gridRef.current?.api.startEditingCell({
        rowIndex: 0,
        colKey: "salary_type_name",
      });
    }, 0);
  }

  // CRUD Functions
  const fetchRowData = async () => {
    const resp = await axiosHelper.get<ApiListResponse<SalaryTypeRowData>>("/salary_type");
    setRowDataList(resp?.items);
  }

  const onSave = async (obj: SalaryTypeRowData) => {
    if (obj._is_created) {
      const response = await axiosHelper.post<SalaryTypeRowData, ApiCrudResponse>(`/salary_type`, obj, undefined, "Are you sure want to save?");
      if (response) {
        obj._id = response.detail.object_id
        obj._is_modified = false;
        obj._is_created = false;
      }
    } else if (obj._is_modified) {
      const response = await axiosHelper.put<SalaryTypeRowData, ApiCrudResponse>(`/salary_type/${obj._id}`, obj, "Are you sure want to save?");
      if (response) {
        obj._is_modified = false;
      }
    }
    gridRef.current?.api.redrawRows();
  }

  const onDelete = async (obj: SalaryTypeRowData) => {
    let needRedraw = true;
    if (!obj._is_created) {
      const response = await axiosHelper.delete<ApiCrudResponse>(`/salary_type/${obj._id}`, "Are you sure want to delete?");
      needRedraw = response !== undefined;
    }
    if (needRedraw) {
      const newRowData: SalaryTypeRowData[] = [];
      gridRef.current?.api.forEachNode((node) => {
        if (node.data._id !== obj._id) {
          newRowData.push(node.data);
        }
      });
      setRowDataList(newRowData);
    }
  }

  // Table functions
  const [colDefs, setColDefs] = useState<(ColDef | ColGroupDef)[]>([
    {
      headerName: "Salary Type Name",
      field: "salary_type_name",
      width: 200,
    },
    {
      headerName: "Description",
      field: "description",
      flex: 1,
      minWidth: 200,
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 120,
      pinned: "right",
      filter: false,
      editable: false,
      cellRenderer: (params: ActionCellRenderParams<SalaryTypeRowData>) => (
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

  const onGridReady = useCallback(async (params: GridReadyEvent) => {
    await fetchRowData();
  }, []);

  const onCellValueChanged = (event: CellValueChangedEvent) => {
    event.data._is_modified = true;
    gridRef.current?.api.redrawRows();
  };

  return (
    <div>
      <div className="flex justify-between px-2 py-4">
        <p className="text-lg font-medium text-base-content/80">
          Salary Type
        </p>
        <NewButton onClick={() => onClickNewRow()}>New Salary Type</NewButton>
      </div>
      <div className="overflow-auto">
        <div className="h-[calc(100vh-10.6rem)] min-w-[600px] min-h-[450px]">
          <AgGridReact
            ref={gridRef}
            columnDefs={colDefs}
            rowData={rowDataList}
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
