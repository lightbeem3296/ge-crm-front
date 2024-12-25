"use client";

import { myTheme } from "@/components/ui/theme/agGrid";
import { axiosHelper } from "@/lib/axios";
import { fieldMapCodes, FieldMapItem, fieldMapMapping, PayrollExportPreviewRequest, PayrollExportPreviewResponse } from "@/types/payroll";
import { lookupValue } from "@/utils/record";
import { faDownload, faPlus, faRefresh, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AllCommunityModule, ColDef, ModuleRegistry, Theme } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function PayrollExportPage() {
  const [fieldMap, setFieldMap] = useState<FieldMapItem[]>(fieldMapCodes.map((key) => ({
    field: key,
    title: lookupValue(fieldMapMapping, key),
  })));
  const gridRef = useRef<AgGridReact>(null);
  const [previewRows, setPreviewRows] = useState<Record<string, string>[]>([]);
  const [colDefs, setColDefs] = useState<ColDef[]>([]);

  // Hooks
  useEffect(() => {
    refreshPreviewTable();
  }, [fieldMap]);

  // UI Handlers
  const handleClickExport = () => {
    alert("export");
  }

  const handleClickAddFieldMapItem = () => {
    setFieldMap([
      ...fieldMap,
      {
        field: "username",
        title: "Username",
      }
    ]);
  }

  const handleClickDeleteFieldMapItem = (delete_index: number) => {
    setFieldMap(fieldMap.filter((item, index) => index !== delete_index));
  }

  const handleChangeFieldMapField = (change_index: number, value: string) => {
    setFieldMap(
      fieldMap.map((item, item_index) => (
        item_index === change_index
          ? {
            field: value,
            title: lookupValue(fieldMapMapping, value),
          }
          : item))
    );
  }

  const handleChangeFieldMapTitle = (change_index: number, value: string) => {
    setFieldMap(
      fieldMap.map((item, item_index) => (
        item_index === change_index
          ? {
            ...item,
            title: value,
          }
          : item))
    );
  }

  const handleClickPreviewRefresh = async () => {
    await refreshPreviewTable();
  }

  // Table Functions
  const refreshPreviewTable = async () => {
    const response = await axiosHelper.post<PayrollExportPreviewRequest, PayrollExportPreviewResponse>("/payroll/export/preview", {
      field_map: fieldMap,
      filter: undefined,
    });
    if (response) {
      response.total_rows;
      response.preview_content;
      setColDefs(fieldMap.map((item) => (
        {
          headerName: item.title,
          field: item.title,
        }
      )));
      setPreviewRows(response.preview_content);
    }
  }
  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme();
  }, []);

  const defaultColDef: ColDef = {
    filter: false,
    sortable: false,
  };

  return (
    <div>
      <div className="flex justify-between px-2 py-4">
        <p className="text-lg font-medium text-base-content/80">
          Payroll Export
        </p>
        <button
          className="btn btn-sm btn-info"
          onClick={() => handleClickExport()}
        >
          <FontAwesomeIcon icon={faDownload} width={12} />Export
        </button>
      </div>
      <div className="overflow-auto grid grid-cols-1 sm:grid-cols-3 gap-2">

        {/* Field Map */}
        <div className="col-span-1 border border-base-content/20 rounded-md p-4">
          <div className="text-md font-medium text-base-content py-2 flex justify-between">
            Field Map
            <button
              className="btn btn-sm btn-primary btn-outline"
              onClick={() => handleClickAddFieldMapItem()}
            >
              <FontAwesomeIcon icon={faPlus} width={12} />Add
            </button>
          </div>
          <div className="flex flex-col gap-2 max-h-64 border border-base-content/20 rounded-md p-4 overflow-auto">
            {fieldMap.map((fieldMapItem, item_index) => (
              <div key={item_index} className="grid grid-cols-5 gap-2">
                <select
                  className="select select-bordered select-sm col-span-2"
                  value={fieldMapItem.field}
                  onChange={(e) => handleChangeFieldMapField(item_index, e.target.value)}
                >
                  <option disabled value="">Select a field</option>
                  {fieldMapCodes.map((key) => (
                    <option key={key} value={key}>
                      {lookupValue(fieldMapMapping, key)}
                    </option>
                  ))}
                </select>
                <input
                  className="input input-sm input-bordered col-span-2"
                  value={fieldMapItem.title}
                  onChange={(e) => handleChangeFieldMapTitle(item_index, e.target.value)}
                />
                <button
                  className="btn btn-sm btn-error btn-outline col-span-1"
                  onClick={() => handleClickDeleteFieldMapItem(item_index)}
                >
                  <FontAwesomeIcon icon={faTrash} width={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div className="col-span-1 border border-base-content/20 rounded-md p-4">
          <p className="text-md font-medium text-base-content">Filter</p>
          <div className="bg-gray-300">
            fff
          </div>
        </div>

        {/* Rule */}
        <div className="col-span-1 border border-base-content/20 rounded-md p-4">
          <p className="text-md font-medium text-base-content">Rule</p>
          <div className="bg-gray-300">
            fff
          </div>
        </div>

        {/* Preview */}
        <div className="col-span-1 sm:col-span-3 border border-base-content/20 rounded-md p-4">
          <div className="text-md font-medium text-base-content py-2 flex justify-between">
            Preview
            <button
              className="btn btn-sm btn-info btn-outline"
              onClick={() => handleClickPreviewRefresh()}
            >
              <FontAwesomeIcon icon={faRefresh} width={12} />Refresh
            </button>
          </div>
          <div className="overflow-auto">
            <div className="h-[20rem] min-w-[600px] min-h-[450px]">
              <AgGridReact
                ref={gridRef}
                columnDefs={colDefs}
                rowData={previewRows}
                theme={theme}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={10}
                paginationPageSizeSelector={[10, 25, 50]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
