'use client';

import React, { useCallback, useMemo, useRef, useState } from "react";
import type { CellValueChangedEvent, ColDef, ColGroupDef, GridReadyEvent, Theme, ValueFormatterParams, ValueGetterParams } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { DeleteButton, SaveButton } from "@/components/ui/datatable/button";
import { axiosHelper } from "@/lib/axios";
import { ActionCellRenderParams, UserRowData } from "@/types/datatable";
import { ApiCrudResponse, ApiListResponse } from "@/types/api";
import { myTheme } from "@/components/ui/theme/agGrid";
import { customAlert, CustomAlertType } from "@/components/ui/alert";
import { userRoleFieldCodes, userRoleFieldMap } from "@/types/user";
import { lookupValue } from "@/utils/record";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function UserPage() {
  const gridRef = useRef<AgGridReact>(null);
  const [rowDataList, setRowDataList] = useState<UserRowData[]>();

  // CRUD Functions
  const fetchRowData = async () => {
    const response = await axiosHelper.get<ApiListResponse<UserRowData>>("/user/list");
    setRowDataList(response?.items);
  }

  const onSave = async (obj: UserRowData) => {
    const response = await axiosHelper.put<UserRowData, ApiCrudResponse>(`/user/update/${obj._id}`, obj);
    if (response) {
      obj._is_modified = false;

      customAlert({
        type: CustomAlertType.SUCCESS,
        message: "Updated successfully.",
      });
    }
    gridRef.current?.api.redrawRows();
  }

  const onDelete = async (obj: UserRowData) => {
    let needRedraw = true;
    if (!obj._is_created) {
      const response = await axiosHelper.delete<ApiCrudResponse>(`/user/delete/${obj._id}`);
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
      const newRowData: UserRowData[] = [];
      gridRef.current?.api.forEachNode((node) => {
        if (node.data._id !== obj._id) {
          newRowData.push(node.data);
        }
      });
      setRowDataList(newRowData);
    }
  }

  // Table functions
  const [colDefs, setColDefs] = useState<(ColDef | ColGroupDef)[]>([ // eslint-disable-line
    {
      headerName: "Username",
      field: "username",
      width: 200,
    },
    {
      headerName: "User Role",
      field: "role",
      minWidth: 200,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: userRoleFieldCodes,
      },
      valueGetter: (params: ValueGetterParams) => {
        return lookupValue(userRoleFieldMap, params.data.role);
      },
      valueFormatter: (params: ValueFormatterParams) => {
        return lookupValue(userRoleFieldMap, params.value) || params.value;
      }
    },
    {
      headerName: "Password",
      field: "password",
      flex: 1,
      minWidth: 200,
      cellRenderer: (): string => {
        return '********';
      }
    },
    {
      headerName: "Actions",
      field: "actions",
      width: 120,
      pinned: "right",
      filter: false,
      editable: false,
      cellRenderer: (params: ActionCellRenderParams<UserRowData>) => (
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
  }, []);

  const onCellValueChanged = (event: CellValueChangedEvent) => {
    event.data._is_modified = true;
    gridRef.current?.api.redrawRows();
  };

  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme();
  }, []);

  return (
    <>
      <div className="flex justify-between px-2 py-4">
        <p className="text-lg font-medium text-base-content/80">
          User
        </p>
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
    </>
  );
};
