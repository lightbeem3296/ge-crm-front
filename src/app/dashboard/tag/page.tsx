'use client';

import React, { useCallback, useRef, useState } from "react";
import type { CellValueChangedEvent, ColDef, ColGroupDef, GridReadyEvent } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import { DeleteButton, NewButton, SaveButton } from "@/components/ui/datatable/button";
import { axiosHelper } from "@/lib/axios";

ModuleRegistry.registerModules([AllCommunityModule]);

interface IRowData {
  _id: string,
  tag_name: string;
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
  onSave: (obj_id: string, obj: IRowData) => void;
  onDelete: (obj_id: string) => void;
}

export default function TagPage() {
  const gridRef = useRef<AgGridReact>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [rowData, setRowData] = useState<IRowData[]>();
  const [newRowFormData, setNewRowFormData] = useState<IRowData>({
    _id: "",
    tag_name: "",
    description: "",
  });

  // UI Functions
  const onClickNewRow = async () => {
    setNewRowFormData({ _id: "", tag_name: "", description: "" });
    dialogRef.current?.showModal();
  }

  const onChangeValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(newRowFormData, name, value);
    setNewRowFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // CRUD Functions
  const onCreate = async () => {
    if (newRowFormData.tag_name === "") {
      alert("Tag name is empty");
      return;
    }
    if (newRowFormData.description === "") {
      alert("Description is empty");
      return;
    }
    await axiosHelper.post<IRowData, any>(`/tag`, newRowFormData);
    await fetchRowData();
    dialogRef.current?.close();
  }

  const fetchRowData = async () => {
    try {
      const tags = await axiosHelper.get<ServerResponse>("/tag");
      setRowData(tags?.items);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const onSave = async (obj_id: string, obj: IRowData) => {
    await axiosHelper.put<IRowData>(`/tag/${obj_id}`, obj, "Are you sure want to save?");
    obj.modified = false;
    gridRef.current?.api.redrawRows();
  }

  const onDelete = async (obj_id: string) => {
    await axiosHelper.delete(`/tag/${obj_id}`, "Are you sure want to delete?");
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
      cellRenderer: (params: CustomButtonParams) => (
        <div className="h-full flex items-center gap-1">
          <SaveButton disabled={params.data.modified === true ? false : true} onClick={() => params.onSave(params.data._id, params.data)} />
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
    console.log(`row changed: ${JSON.stringify(event.data)}`);
  };

  return (
    <div>
      <div className="flex justify-between px-2 py-4">
        <p className="text-lg font-medium text-gray-700">
          Tag
        </p>
        <NewButton onClick={() => onClickNewRow()}>New Tag</NewButton>
        <dialog ref={dialogRef} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg p-2 mb-8 border-b">Add New Tag</h3>
            <div className="flex flex-col gap-y-4">
              <label className="input input-sm input-bordered flex items-center gap-2">
                Tag Name:
                <input type="text" name="tag_name" className="grow" placeholder="Remote Worker" value={newRowFormData.tag_name} onChange={onChangeValues} />
              </label>
              <label className="input input-sm input-bordered flex items-center gap-2">
                Description:
                <input type="text" name="description" className="grow" placeholder="Indicates employees working from home or another remote location." value={newRowFormData.description} onChange={onChangeValues} />
              </label>
            </div>
            <div className="modal-action">
              <button className="btn btn-primary btn-sm" onClick={() => onCreate()}>Add</button>
              <form method="dialog">
                <button className="btn btn-sm">Cancel</button>
              </form>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
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
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 25, 50]}
          />
        </div>
      </div>
    </div>
  );
};
