'use client';

import React, { useCallback, useMemo, useRef, useState } from "react";
import type { CellValueChangedEvent, ColDef, ColGroupDef, GridReadyEvent, Theme } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { DeleteButton, NewButton, SaveButton } from "@/components/ui/datatable/button";
import { axiosHelper } from "@/lib/axios";
import { ActionCellRenderParams, TagRowData } from "@/types/datatable";
import { ApiCrudResponse, ApiListResponse } from "@/types/api";
import { myTheme } from "@/components/ui/theme/agGrid";
import { customAlert, CustomAlertType } from "@/components/ui/alert";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function TagPage() {
  const gridRef = useRef<AgGridReact>(null);
  const [rowDataList, setRowDataList] = useState<TagRowData[]>();

  // UI Functions
  const onClickNewRow = async () => {
    const rowData: TagRowData = {
      tag_name: "",
      description: "",

      _is_modified: true,
      _is_created: true,
    };
    setRowDataList(rowDataList ? [rowData, ...rowDataList] : [rowData]);
    setTimeout(() => {
      gridRef.current?.api.paginationGoToPage(0);
      gridRef.current?.api.startEditingCell({
        rowIndex: 0,
        colKey: "tag_name",
      });
    }, 0);
  }

  // CRUD Functions
  const fetchRowData = async () => {
    const response = await axiosHelper.get<ApiListResponse<TagRowData>>("/tag/list");
    setRowDataList(response?.items);
  }

  const onSave = async (obj: TagRowData) => {
    if (obj._is_created) {
      const response = await axiosHelper.post<TagRowData, ApiCrudResponse>(`/tag/create`, obj, undefined);
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
      const response = await axiosHelper.put<TagRowData, ApiCrudResponse>(`/tag/update/${obj._id}`, obj);
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

  const onDelete = async (obj: TagRowData) => {
    let needRedraw = true;
    if (!obj._is_created) {
      const response = await axiosHelper.delete<ApiCrudResponse>(`/tag/delete/${obj._id}`);
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
      const newRowData: TagRowData[] = [];
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
      headerName: "Tag Name",
      field: "tag_name",
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
      sortable: false,
      cellRenderer: (params: ActionCellRenderParams<TagRowData>) => (
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
    <div>
      <div className="flex justify-between px-2 py-4">
        <p className="text-lg font-medium text-base-content/80">
          Tag
        </p>
        <NewButton onClick={() => onClickNewRow()}>New Tag</NewButton>
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
