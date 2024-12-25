"use client";

import FilterComponent from "@/components/ui/Filter";
import { myTheme } from "@/components/ui/theme/agGrid";
import { axiosHelper } from "@/lib/axios";
import { getRuleDisplay, getRuleMappings } from "@/services/ruleService";
import { ComparableFilterField, StringFilterField, ObjectFilterField, FilterType } from "@/types/filter";
import { fieldMapCodes, FieldMapItem, fieldMapMapping, PayrollExportFilterField, PayrollExportPreviewRequest, PayrollExportPreviewResponse, PayrollExportRequest } from "@/types/payroll";
import { extractKeys, lookupValue } from "@/utils/record";
import { faDownload, faPlus, faRefresh, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AllCommunityModule, ColDef, ModuleRegistry, Theme } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function PayrollExportPage() {
  // State variables
  const [exportFileName, setExportFileName] = useState("payroll.csv");
  const [exportFieldMap, setExportFieldMap] = useState<FieldMapItem[]>(fieldMapCodes.map((key) => ({
    field: key,
    title: lookupValue(fieldMapMapping, key),
  })));

  const [filterUsername, setFilterUsername] = useState<StringFilterField>();
  const [filterMnr, setFilterMnr] = useState<ObjectFilterField>();
  const [filterRole, setFilterRole] = useState<ObjectFilterField>();
  const [filterDepartment, setFilterDepartment] = useState<StringFilterField>();
  const [filterEmploymentStartDate, setFilterEmploymentStartDate] = useState<ComparableFilterField>();
  const [filterEmploymentEndDate, setFilterEmploymentEndDate] = useState<ComparableFilterField>();
  const [filterSalaryType, setFilterSalaryType] = useState<ObjectFilterField>();
  const [filterHourlyRate, setFilterHourlyRate] = useState<ComparableFilterField>();
  const [filterHoursWorked, setFilterHoursWorked] = useState<ComparableFilterField>();
  const [filterPointsEeaned, setFilterPointsEeaned] = useState<ComparableFilterField>();
  const [filterSalary, setFilterSalary] = useState<ComparableFilterField>();
  const [filterBonus, setFilterBonus] = useState<ComparableFilterField>();
  const [filterDeduction, setFilterDeduction] = useState<ComparableFilterField>();

  const [exportRule, setExportRule] = useState("");
  const [exportRuleDiaplay, setExportRuleDisplay] = useState("");

  const gridRef = useRef<AgGridReact>(null);
  const [previewRows, setPreviewRows] = useState<Record<string, string>[]>([]);
  const [colDefs, setColDefs] = useState<ColDef[]>([]);

  const [ruleMappings, setRuleMappins] = useState<Record<string, string>>();
  const [ruleCodes, setRuleCodes] = useState<string[]>();

  // Hooks
  useEffect(() => {
    refreshPreviewTable();
  }, [
    exportFieldMap,
    filterUsername,
    filterMnr,
    filterRole,
    filterDepartment,
    filterEmploymentStartDate,
    filterEmploymentEndDate,
    filterSalaryType,
    filterHourlyRate,
    filterHoursWorked,
    filterPointsEeaned,
    filterSalary,
    filterBonus,
    filterDeduction,
    exportRule,
  ]);

  useEffect(() => {
    const updateRuleDisplay = async () => {
      if (exportRule != "") {
        const ruleDisplay = await getRuleDisplay(exportRule);
        if (ruleDisplay) {
          setExportRuleDisplay(ruleDisplay);
        }
      } else {
        setExportRuleDisplay("");
      }
    }
    updateRuleDisplay();
  }, [exportRule]);

  useEffect(() => {
    const fetchRuleMappings = async () => {
      const resp = await getRuleMappings();
      setRuleMappins(resp);
      setRuleCodes(extractKeys(resp));
    }
    fetchRuleMappings();
  }, []);

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
        rule: exportRule || undefined,
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
      rule: exportRule || undefined,
    });
    if (response) {
      if (response.preview_content.length > 0) {
        const headers = extractKeys(response.preview_content[0]);
        setColDefs(headers.map((header) => (
          {
            headerName: header,
            field: header,
          }
        )));
        setPreviewRows(response.preview_content);
      } else {
        setColDefs([]);
        setPreviewRows([]);
      }
    }
  }

  const theme = useMemo<Theme | "legacy">(() => {
    return myTheme();
  }, []);

  const defaultColDef: ColDef = {
    filter: true,
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
          <div className="flex flex-col gap-2 max-h-80 border border-base-content/20 rounded-md p-4 overflow-auto">
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
          <div className="flex flex-col gap-2 max-h-80 border border-base-content/20 rounded-md p-4 overflow-auto">
            <FilterComponent
              field={PayrollExportFilterField.USERNAME}
              label="Username"
              type={FilterType.STRING_FILTER}
              setFilterField={setFilterUsername}
            />
            <FilterComponent
              field={PayrollExportFilterField.M_NR}
              label="M-Nr"
              type={FilterType.OBJECT_FILTER}
              setFilterField={setFilterMnr}
            />
            <FilterComponent
              field={PayrollExportFilterField.ROLE}
              label="Role"
              type={FilterType.OBJECT_FILTER}
              setFilterField={setFilterRole}
            />
            <FilterComponent
              field={PayrollExportFilterField.DEPARTMENT}
              label="Department"
              type={FilterType.STRING_FILTER}
              setFilterField={setFilterDepartment}
            />
            <FilterComponent
              field={PayrollExportFilterField.EMPLOYMENT_START_DATE}
              label="Employment Start Date"
              type={FilterType.COMPARIBLE_FILTER}
              setFilterField={setFilterEmploymentStartDate}
            />
            <FilterComponent
              field={PayrollExportFilterField.EMPLOYMENT_END_DATE}
              label="Employment End Date"
              type={FilterType.COMPARIBLE_FILTER}
              setFilterField={setFilterEmploymentEndDate}
            />
            <FilterComponent
              field={PayrollExportFilterField.SALARY_TYPE}
              label="Salary Type"
              type={FilterType.OBJECT_FILTER}
              setFilterField={setFilterSalaryType}
            />
            <FilterComponent
              field={PayrollExportFilterField.HOURLY_RATE}
              label="Hourly Rate"
              type={FilterType.COMPARIBLE_FILTER}
              setFilterField={setFilterHourlyRate}
            />
            <FilterComponent
              field={PayrollExportFilterField.HOURS_WORKED}
              label="Hours Worked"
              type={FilterType.COMPARIBLE_FILTER}
              setFilterField={setFilterHoursWorked}
            />
            <FilterComponent
              field={PayrollExportFilterField.POINTS_EARNED}
              label="Points Earned"
              type={FilterType.COMPARIBLE_FILTER}
              setFilterField={setFilterPointsEeaned}
            />
            <FilterComponent
              field={PayrollExportFilterField.SALARY}
              label="Salary"
              type={FilterType.COMPARIBLE_FILTER}
              setFilterField={setFilterSalary}
            />
            <FilterComponent
              field={PayrollExportFilterField.BONUS}
              label="Bonus"
              type={FilterType.COMPARIBLE_FILTER}
              setFilterField={setFilterBonus}
            />
            <FilterComponent
              field={PayrollExportFilterField.DEDUCTION}
              label="Deduction"
              type={FilterType.COMPARIBLE_FILTER}
              setFilterField={setFilterDeduction}
            />
          </div>
        </div>

        {/* Rule */}
        <div className="col-span-1 border border-base-content/20 rounded-md p-4">
          <div className="text-md font-medium text-base-content h-12 flex justify-between items-center">
            Rule
          </div>
          <div className="flex flex-col gap-2 h-80 rounded-md">
            <select
              className="select select-bordered select-sm w-full"
              value={exportRule}
              onChange={(e) => setExportRule(e.target.value)}
            >
              <option value="">Not Selected</option>
              {ruleCodes?.map((key) => (
                <option key={key} value={key}>{lookupValue(ruleMappings, key)}</option>
              ))}
            </select>
            <textarea
              className="textarea textarea-bordered text-xs resize-none font-mono grow"
              placeholder="Rule display"
              value={exportRuleDiaplay}
              readOnly
            />
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
