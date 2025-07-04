'use client';

import React, { useCallback, useMemo, useRef, useState } from "react";
import type { CellValueChangedEvent, ColDef, ColGroupDef, GridReadyEvent, Theme } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { DeleteButton, EditButton, NewButton } from "@/components/ui/datatable/button";
import { axiosHelper } from "@/lib/axios";
import { ActionCellRenderParams, RuleRowData } from "@/types/datatable";
import { ApiGeneralResponse, ApiListResponse } from "@/types/api";
import { useRouter } from "next/navigation";
import { myTheme } from "@/components/ui/theme/agGrid";
import { customAlert, CustomAlertType } from "@/components/ui/alert";
import { RuleEditPageMode } from "@/types/rule/edit";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function RulePage() {
  const router = useRouter();
  const gridRef = useRef<AgGridReact>(null);
  const [rowDataList, setRowDataList] = useState<RuleRowData[]>();

  // UI Functions
  const onClickNewRow = async () => {
    router.push(`/main/data/rule/edit?mode=${RuleEditPageMode.CREATE}`);
  }

  const onEdit = async (obj: RuleRowData) => {
    router.push(`/main/data/rule/edit?mode=${RuleEditPageMode.EDIT}&id=${obj._id}`);
  }

  // CRUD Functions
  const fetchRowData = async () => {
    const response = await axiosHelper.get<ApiListResponse<RuleRowData>>("/rule/list");
    setRowDataList(response?.items);
  }

  const onDelete = async (obj: RuleRowData) => {
    let needRedraw = true;
    if (!obj._is_created) {
      const response = await axiosHelper.delete<ApiGeneralResponse>(`/rule/delete/${obj._id}`);
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
      const newRowData: RuleRowData[] = [];
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
      headerName: "Rule Name",
      field: "rule_name",
      width: 200,
    },
    {
      headerName: "Description",
      field: "description",
      minWidth: 200,
    },
    {
      headerName: "Display",
      field: "display",
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
      cellRenderer: (params: ActionCellRenderParams<RuleRowData>) => (
        <div className="h-full flex items-center gap-1">
          <EditButton onClick={() => params.onEdit ? params.onEdit(params.data) : alert("click")} />
          <DeleteButton onClick={() => params.onDelete ? params.onDelete(params.data) : alert("click")} />
        </div>
      ),
      cellRendererParams: {
        onEdit: onEdit,
        onDelete: onDelete,
      },
    },
  ]);

  const defaultColDef: ColDef = {
    filter: true,
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
          Rule
        </p>
        <NewButton onClick={() => onClickNewRow()}>New Rule</NewButton>
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
