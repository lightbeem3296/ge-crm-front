'use client';

import React, { useCallback, useMemo, useRef, useState } from "react";
import type { CellValueChangedEvent, ColDef, ColGroupDef, GridReadyEvent, Theme } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { DeleteButton, NewButton, SaveButton } from "@/components/ui/datatable/button";
import { axiosHelper } from "@/lib/axios";
import { ActionCellRenderParams, RoleRowData } from "@/types/datatable";
import { ApiCrudResponse, ApiListResponse } from "@/types/api";
import { myTheme } from "@/components/ui/theme/agGrid";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function RolePage() {
  const gridRef = useRef<AgGridReact>(null);
  const [rowDataList, setRowDataList] = useState<RoleRowData[]>();

  // UI Functions
  const onClickNewRow = async () => {
    const rowData: RoleRowData = {
      role_name: "",
      description: "",

      _is_modified: true,
      _is_created: true,
    };
    setRowDataList(rowDataList ? [rowData, ...rowDataList] : [rowData]);
    setTimeout(() => {
      gridRef.current?.api.paginationGoToPage(0);
      gridRef.current?.api.startEditingCell({
        rowIndex: 0,
        colKey: "role_name",
      });
    }, 0);
  }

  // CRUD Functions
  const fetchRowData = async () => {
    const resp = await axiosHelper.get<ApiListResponse<RoleRowData>>("/role");
    setRowDataList(resp?.items);
  }

  const onSave = async (obj: RoleRowData) => {
    if (obj._is_created) {
      const response = await axiosHelper.post<RoleRowData, ApiCrudResponse>(`/role`, obj, undefined, "Are you sure want to save?");
      if (response) {
        obj._id = response.detail.object_id
        obj._is_modified = false;
        obj._is_created = false;
      }
    } else if (obj._is_modified) {
      const response = await axiosHelper.put<RoleRowData, ApiCrudResponse>(`/role/${obj._id}`, obj, "Are you sure want to save?");
      if (response) {
        obj._is_modified = false;
      }
    }
    gridRef.current?.api.redrawRows();
  }

  const onDelete = async (obj: RoleRowData) => {
    let needRedraw = true;
    if (!obj._is_created) {
      const response = await axiosHelper.delete<ApiCrudResponse>(`/role/${obj._id}`, "Are you sure want to delete?");
      needRedraw = response !== undefined;
    }
    if (needRedraw) {
      const newRowData: RoleRowData[] = [];
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
      headerName: "Role Name",
      field: "role_name",
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
      cellRenderer: (params: ActionCellRenderParams<RoleRowData>) => (
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

  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme;
  }, []);

  return (
    <div>
      <div className="flex justify-between px-2 py-4">
        <p className="text-lg font-medium text-base-content/80">
          Role
        </p>
        <NewButton onClick={() => onClickNewRow()}>New Role</NewButton>
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
          />
        </div>
      </div>
    </div>
  );
};
