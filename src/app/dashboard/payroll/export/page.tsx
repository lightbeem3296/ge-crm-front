"use client";

import { extractKeys, lookupValue } from "@/utils/record";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface FieldMapItem {
  field: string;
  title: string;
}

export default function PayrollExportPage() {
  const [fieldMap, setFieldMap] = useState<FieldMapItem[]>([{
    field: "username",
    title: "Username",
  }]);

  const fieldMapMapping: Record<string, string> = {
    "username": "Username",
    "m_nr": "M-Nr",
    "role": "Role",
    "department": "Department",
    "employment_start_date": "Employment Start Date",
    "employment_end_date": "Employment End Date",
    "salary_type": "Salary Type",
    "hourly_rate": "Hourly Rate",
    "hours_worked": "Hours Worked",
    "points_earned": "Points Earned",
    "salary": "Salary",
    "bonus": "Bonus",
    "deduction": "Deduction",
    "tags": "Tags",
  }
  const fieldMapCodes = extractKeys(fieldMapMapping);

  // UI Handlers
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
    )
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
    )
  }

  return (
    <div>
      <div className="flex justify-between px-2 py-4">
        <p className="text-lg font-medium text-base-content/80">
          Payroll Export
        </p>
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
          <div className="flex flex-col gap-2">
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
          <p className="text-md font-medium text-base-content">Preview</p>
          <div className="bg-gray-300">
            fff
          </div>
        </div>
      </div>
    </div>
  );
}
