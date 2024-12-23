'use client';

import React, { useCallback, useRef, useState } from "react";
import type { CellValueChangedEvent, ColDef, ColGroupDef, GridReadyEvent } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { DeleteButton, EditButton, NewButton, ViewButton } from "@/components/ui/datatable/button";
import { axiosHelper } from "@/lib/axios";
import { ActionCellRenderParams, RuleRowData } from "@/types/datatable";
import { ApiCrudResponse, ApiListResponse } from "@/types/api";
import RuleForm from "@/components/forms/RuleForm";

ModuleRegistry.registerModules([AllCommunityModule]);

export enum FormModeEnum {
  VIEW = "view",
  EDIT = "edit",
  CREATE = "create",
}


export default function RulePage() {
  const gridRef = useRef<AgGridReact>(null);
  const [rowDataList, setRowDataList] = useState<RuleRowData[]>();
  let [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  let [formData, setFormData] = useState<RuleRowData>({
    rule_name: "",
    description: "",
    atomic_rules: [],
  })
  let [formMode, setFormMode] = useState<FormModeEnum>(FormModeEnum.VIEW);

  // UI Functions
  function openForm() {
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
  }

  const onClickNewRow = async () => {
    setFormData({
      rule_name: "New Rule",
      description: "This is a new Rule.",
      atomic_rules: [],
    });
    setFormMode(FormModeEnum.CREATE);
    openForm();
  }

  // CRUD Functions
  const fetchRowData = async () => {
    const resp = await axiosHelper.get<ApiListResponse<RuleRowData>>("/rule");
    setRowDataList(resp?.items);
  }

  const onView = async (obj: RuleRowData) => {
    setFormData(obj);
    setFormMode(FormModeEnum.VIEW);
    openForm();
  }

  const onEdit = async (obj: RuleRowData) => {
    setFormData(obj);
    setFormMode(FormModeEnum.EDIT);
    openForm();
  }

  const onDelete = async (obj: RuleRowData) => {
    let needRedraw = true;
    if (!obj._is_created) {
      const response = await axiosHelper.delete<ApiCrudResponse>(`/rule/${obj._id}`, "Are you sure want to delete?");
      needRedraw = response !== undefined;
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
  const [colDefs, setColDefs] = useState<(ColDef | ColGroupDef)[]>([
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
      width: 160,
      pinned: "right",
      filter: false,
      editable: false,
      cellRenderer: (params: ActionCellRenderParams<RuleRowData>) => (
        <div className="h-full flex items-center gap-1">
          <ViewButton onClick={() => params.onView ? params.onView(params.data) : alert("click")} />
          <EditButton onClick={() => params.onEdit ? params.onEdit(params.data) : alert("click")} />
          <DeleteButton onClick={() => params.onDelete ? params.onDelete(params.data) : alert("click")} />
        </div>
      ),
      cellRendererParams: {
        onView: onView,
        onEdit: onEdit,
        onDelete: onDelete,
      },
    },
  ]);

  const defaultColDef: ColDef = {
    filter: true,
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
        <p className="text-lg font-medium text-gray-700">
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
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onCellValueChanged={onCellValueChanged}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 25, 50]}
          />
        </div>
      </div>
      <RuleForm isFormOpen={isFormOpen} closeForm={closeForm} rule={formData} formMode={formMode} />
    </div>
  );
};
