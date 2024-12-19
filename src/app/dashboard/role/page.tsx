'use client';

import React, { useCallback, useRef, useState } from "react";
import type { CellValueChangedEvent, ColDef, ColGroupDef, GridReadyEvent } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry, themeBalham } from "ag-grid-community";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import { DeleteButton, SaveButton } from "@/components/ui/datatable/button";
import { axiosHelper } from "@/lib/axios";

ModuleRegistry.registerModules([AllCommunityModule]);

interface IRowData {
  _id: string,
  role_name: string;
  description: string;
  modified?: boolean;
}

interface ServerResponse {
  total: number;
  skip: number;
  limit: number;
  items: IRowData[];
}

interface CustomButtonParams extends CustomCellRendererProps {
  onUpdate: (obj_id: string, obj: any) => void;
  onDelete: (obj_id: string) => void;
}

export default function RolePage() {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<IRowData[]>();

  const onUpdate = async (obj_id: string, obj: IRowData) => {
    await axiosHelper.put<IRowData>(`/role/${obj_id}`, obj, "Are you sure want to update?");
    obj.modified = false;
    gridRef.current?.api.redrawRows();
  }

  const onDelete = async (obj_id: string) => {
    await axiosHelper.delete(`/role/${obj_id}`, "Are you sure want to delete?");
  }

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
          <SaveButton disabled={params.data.modified === true ? false : true} onClick={() => params.onUpdate(params.data._id, params.data)} />
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
      const roles = await axiosHelper.get<ServerResponse>("/role");
      setRowData(roles?.items);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

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
      <div className="text-lg font-medium px-2 py-4">Role</div>
      <div className="h-[calc(100vh-10.6rem)] min-h-[450px] min-w-[600px]">
        <AgGridReact
          ref={gridRef}
          columnDefs={colDefs}
          rowData={rowData}
          theme={themeBalham}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          onCellValueChanged={onCellValueChanged}
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
        />
      </div>
    </div>
  );
};
