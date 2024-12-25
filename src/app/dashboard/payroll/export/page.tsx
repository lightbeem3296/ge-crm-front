"use client";

import Filter from "@/components/ui/Filter";
import { myTheme } from "@/components/ui/theme/agGrid";
import { axiosHelper } from "@/lib/axios";
import { ComparableFilterField, StringFilterField, ValueFilterField } from "@/types/filter";
import { fieldMapCodes, FieldMapItem, fieldMapMapping, PayrollExportFilter, PayrollExportPreviewRequest, PayrollExportPreviewResponse, PayrollExportRequest } from "@/types/payroll";
import { lookupValue } from "@/utils/record";
import { faDownload, faPlus, faRefresh, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AllCommunityModule, ColDef, ModuleRegistry, Theme } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function PayrollExportPage() {
  const [exportFileName, setExportFileName] = useState("payroll.csv");
  const [exportFieldMap, setExportFieldMap] = useState<FieldMapItem[]>(fieldMapCodes.map((key) => ({
    field: key,
    title: lookupValue(fieldMapMapping, key),
  })));

  const [filterUsername, setFilterUsername] = useState<StringFilterField>();
  const [filterMnr, setFilterMnr] = useState<ValueFilterField<number>>();
  const [filterRole, setFilterRole] = useState<ValueFilterField<string>>();
  const [filterDepartment, setFilterDepartment] = useState<StringFilterField>();
  const [filterEmploymentStartDate, setFilterEmploymentStartDate] = useState<ComparableFilterField<string>>();
  const [filterEmploymentEndDate, setFilterEmploymentEndDate] = useState<ComparableFilterField<string>>();
  const [filterSalaryType, setFilterSalaryType] = useState<ValueFilterField<string>>();
  const [filterHourlyRate, setFilterHourlyRate] = useState<ComparableFilterField<number>>();
  const [filterHoursWorked, setFilterHoursWorked] = useState<ComparableFilterField<number>>();
  const [filterPointsEeaned, setFilterPointsEeaned] = useState<ComparableFilterField<number>>();
  const [filterSalary, setFilterSalary] = useState<ComparableFilterField<number>>();
  const [filterBonus, setFilterBonus] = useState<ComparableFilterField<number>>();
  const [filterDeduction, setFilterDeduction] = useState<ComparableFilterField<number>>();

  const gridRef = useRef<AgGridReact>(null);
  const [previewRows, setPreviewRows] = useState<Record<string, string>[]>([]);
  const [colDefs, setColDefs] = useState<ColDef[]>([]);

  // Hooks
  useEffect(() => {
    refreshPreviewTable();
  }, [exportFieldMap]);

  // UI Handlers
  const handleChangeExportFileName = (fileName: string) => {
    setExportFileName(fileName);
  }

  const handleClickExport = async () => {
    await axiosHelper.download_post<PayrollExportRequest>("/payroll/export",
      {
        filename: exportFileName,
        field_map: exportFieldMap,
        filter: {
          username: filterUsername,
          m_nr: filterMnr,
          role: filterRole,
          department: filterDepartment,
          employment_start_date: filterEmploymentStartDate,
          employment_end_date: filterEmploymentEndDate,
          salary_type: filterSalaryType,
          hourly_rate: filterHourlyRate,
          hours_worked: filterHoursWorked,
          points_earned: filterPointsEeaned,
          salary: filterSalary,
          bonus: filterBonus,
          deduction: filterDeduction,
        },
      });
  }

  const handleClickAddFieldMapItem = () => {
    setExportFieldMap([
      ...exportFieldMap,
      {
        field: "username",
        title: "Username",
      }
    ]);
  }

  const handleClickDeleteFieldMapItem = (delete_index: number) => {
    setExportFieldMap(exportFieldMap.filter((item, index) => index !== delete_index));
  }

  const handleChangeFieldMapField = (change_index: number, value: string) => {
    setExportFieldMap(
      exportFieldMap.map((item, item_index) => (
        item_index === change_index
          ? {
            field: value,
            title: lookupValue(fieldMapMapping, value),
          }
          : item))
    );
  }

  const handleChangeFieldMapTitle = (change_index: number, value: string) => {
    setExportFieldMap(
      exportFieldMap.map((item, item_index) => (
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
      field_map: exportFieldMap,
      filter: {
        username: filterUsername,
        m_nr: filterMnr,
        role: filterRole,
        department: filterDepartment,
        employment_start_date: filterEmploymentStartDate,
        employment_end_date: filterEmploymentEndDate,
        salary_type: filterSalaryType,
        hourly_rate: filterHourlyRate,
        hours_worked: filterHoursWorked,
        points_earned: filterPointsEeaned,
        salary: filterSalary,
        bonus: filterBonus,
        deduction: filterDeduction,
      },
    });
    if (response) {
      response.total_rows;
      response.preview_content;
      setColDefs(exportFieldMap.map((item) => (
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
        <div className="flex justify-end gap-2">
          <input
            className="input input-sm input-bordered"
            value={exportFileName}
            onChange={(e) => handleChangeExportFileName(e.target.value)}
          />
          <button
            className="btn btn-sm btn-info"
            onClick={() => handleClickExport()}
          >
            <FontAwesomeIcon icon={faDownload} width={12} />Export
          </button>
        </div>
      </div>
      <div className="overflow-auto grid grid-cols-1 sm:grid-cols-3 gap-2">

        {/* Field Map */}
        <div className="col-span-1 border border-base-content/20 rounded-md p-4">
          <div className="text-md font-medium text-base-content h-12 flex justify-between items-center">
            Field Map
            <button
              className="btn btn-sm btn-primary btn-outline"
              onClick={() => handleClickAddFieldMapItem()}
            >
              <FontAwesomeIcon icon={faPlus} width={12} />Add
            </button>
          </div>
          <div className="flex flex-col gap-2 max-h-64 border border-base-content/20 rounded-md p-4 overflow-auto">
            {exportFieldMap.map((fieldMapItem, item_index) => (
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
          <div className="text-md font-medium text-base-content h-12 flex justify-between items-center">
            Filter
          </div>
          <div className="flex flex-col gap-2 max-h-64 border border-base-content/20 rounded-md p-4 overflow-auto">
            <Filter label="Username" setValue={setFilterUsername} />
            <Filter label="M-Nr" setValue={setFilterMnr} />
            <Filter label="Role" setValue={setFilterRole} />
            <Filter label="Department" setValue={setFilterDepartment} />
            <Filter label="Employment Start Date" setValue={setFilterEmploymentStartDate} />
            <Filter label="Employment End Date" setValue={setFilterEmploymentEndDate} />
            <Filter label="Salary Type" setValue={setFilterSalaryType} />
            <Filter label="Hourly Rate" setValue={setFilterHourlyRate} />
            <Filter label="Hours Worked" setValue={setFilterHoursWorked} />
            <Filter label="Points Earned" setValue={setFilterPointsEeaned} />
            <Filter label="Salary" setValue={setFilterSalary} />
            <Filter label="Bonus" setValue={setFilterBonus} />
            <Filter label="Deduction" setValue={setFilterDeduction} />
          </div>
        </div>

        {/* Rule */}
        <div className="col-span-1 border border-base-content/20 rounded-md p-4">
          <div className="text-md font-medium text-base-content h-12 flex justify-between items-center">
            Rule
          </div>
          <div className="bg-gray-300">
            fff
          </div>
        </div>

        {/* Preview */}
        <div className="col-span-1 sm:col-span-3 border border-base-content/20 rounded-md p-4">
          <div className="text-md font-medium text-base-content h-12 flex justify-between items-center">
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
