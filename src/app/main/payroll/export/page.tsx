"use client";

import { customAlert, CustomAlertType } from "@/components/ui/alert";
import ExportFilterComponent from "@/components/ui/export/Filter";
import { myTheme } from "@/components/ui/theme/agGrid";
import { axiosHelper } from "@/lib/axios";
import { getRuleDisplay, getRuleMappings } from "@/services/ruleService";
import { ComparableFilterField, EmployeeFilterField, FilterType, ListFilterField, ObjectFilterField, StringFilterField } from "@/types/filter";
import { fieldMapCodes, FieldMapItem, fieldMapMapping, initialFieldMapCodes, PayrollExportPreviewRequest, PayrollExportPreviewResponse, PayrollExportRequest } from "@/types/payroll";
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
  const [exportFieldMap, setExportFieldMap] = useState<FieldMapItem[]>(initialFieldMapCodes.map((key) => ({
    field: key,
    title: lookupValue(fieldMapMapping, key),
  })));

  const [depositionsDate, setDepositionsDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [paycheckPeriodStart, setPaycheckPeriodStart] = useState<string>(new Date().toISOString().split("T")[0]);
  const [paycheckPeriodEnd, setPaycheckPeriodEnd] = useState<string>(new Date().toISOString().split("T")[0]);

  const [filterUsername, setFilterUsername] = useState<StringFilterField>();
  const [filterMnr, setFilterMnr] = useState<ObjectFilterField>();
  const [filterRole, setFilterRole] = useState<ObjectFilterField>();
  const [filterDepartment, setFilterDepartment] = useState<StringFilterField>();
  const [filterInitials, setFilterInitials] = useState<StringFilterField>();
  const [filterEmployerVatID, setFilterEmployerVatID] = useState<StringFilterField>();
  const [filterEmployeeLink, setFilterEmployeeLink] = useState<StringFilterField>();
  const [filterEmploymentStartDate, setFilterEmploymentStartDate] = useState<ComparableFilterField>();
  const [filterEmploymentEndDate, setFilterEmploymentEndDate] = useState<ComparableFilterField>();
  const [filterSalaryType, setFilterSalaryType] = useState<ObjectFilterField>();
  const [filterHourlyRate, setFilterHourlyRate] = useState<ComparableFilterField>();
  const [filterHoursWorked, setFilterHoursWorked] = useState<ComparableFilterField>();
  const [filterPointsEeaned, setFilterPointsEeaned] = useState<ComparableFilterField>();
  const [filterSalary, setFilterSalary] = useState<ComparableFilterField>();
  const [filterBonus, setFilterBonus] = useState<ComparableFilterField>();
  const [filterDeduction, setFilterDeduction] = useState<ComparableFilterField>();
  const [filterTags, setFilterTags] = useState<ListFilterField>();

  const [exportRule, setExportRule] = useState("");
  const [exportRuleDiaplay, setExportRuleDisplay] = useState("");

  const gridRef = useRef<AgGridReact>(null);
  const [previewRows, setPreviewRows] = useState<Record<string, string>[]>([]);
  const [colDefs, setColDefs] = useState<ColDef[]>([]);

  const [ruleMappings, setRuleMappins] = useState<Record<string, string>>();
  const [ruleCodes, setRuleCodes] = useState<string[]>();

  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [previewLoading, setPreviewLoading] = useState<boolean>(false);

  // Hooks
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
    try {
      setExportLoading(true);

      if (!exportFileName) {
        customAlert({
          type: CustomAlertType.ERROR,
          title: "Input Error",
          message: "Export filename is invalid.",
        });
        return;
      }

      await axiosHelper.download_post<PayrollExportRequest>("/payroll/export/download",
        {
          filename: exportFileName,
          depositions_date: depositionsDate,
          paycheck_period_start: paycheckPeriodStart,
          paycheck_period_end: paycheckPeriodEnd,
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
            tags: filterTags,
          },
          rule: exportRule || undefined,
        });
    } finally {
      setExportLoading(false);
    }
  }

  const handleClickAddFieldMapItem = () => {
    setExportFieldMap([
      ...exportFieldMap,
      {
        field: "custom_field",
        title: "Custom Field",
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
    try {
      setPreviewLoading(true);
      const response = await axiosHelper.post<PayrollExportPreviewRequest, PayrollExportPreviewResponse>("/payroll/export/preview", {
        depositions_date: depositionsDate,
        paycheck_period_start: paycheckPeriodStart,
        paycheck_period_end: paycheckPeriodEnd,
        field_map: exportFieldMap,
        filter: {
          username: filterUsername,
          m_nr: filterMnr,
          role: filterRole,
          department: filterDepartment,
          initials: filterInitials,
          employer_vat_id: filterEmployerVatID,
          employee_link: filterEmployeeLink,
          employment_start_date: filterEmploymentStartDate,
          employment_end_date: filterEmploymentEndDate,
          salary_type: filterSalaryType,
          hourly_rate: filterHourlyRate,
          hours_worked: filterHoursWorked,
          points_earned: filterPointsEeaned,
          salary: filterSalary,
          bonus: filterBonus,
          deduction: filterDeduction,
          tags: filterTags,
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
    } finally {
      setPreviewLoading(false);
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
      <div className="flex flex-col sm:flex-row justify-between px-2 py-4 gap-2">
        <p className="text-lg font-medium text-base-content/80">
          Payroll Export
        </p>
        <div className="flex justify-end gap-2">
          <input
            className="input input-sm input-bordered"
            value={exportFileName}
            placeholder="Export filename"
            onChange={(e) => handleChangeExportFileName(e.target.value)}
          />
          <button
            className="btn btn-sm btn-info text-gray-100"
            onClick={() => handleClickExport()}
          >
            {exportLoading
              ? <span className="loading loading-spinner loading-xs"></span>
              : <FontAwesomeIcon icon={faDownload} width={12} />
            }
            Export
          </button>
        </div>
      </div>
      <div className="overflow-auto grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full col-span-1 sm:col-span-3">
          <fieldset className="fieldset w-full max-w-xs">
            <label className="fieldset-legend">Depositions Date</label>
            <input
              type="date"
              placeholder="Type here"
              className="input input-sm w-full max-w-xs"
              value={depositionsDate}
              onChange={(e) => setDepositionsDate(e.target.value)}
            />
          </fieldset>
          <fieldset className="fieldset w-full max-w-xs">
            <label className="fieldset-legend">Paycheck Period Start</label>
            <input
              type="date"
              placeholder="Type here"
              className="input input-sm w-full max-w-xs"
              value={paycheckPeriodStart}
              onChange={(e) => setPaycheckPeriodStart(e.target.value)}
            />
          </fieldset>
          <fieldset className="fieldset w-full max-w-xs">
            <label className="fieldset-legend">Paycheck Period End</label>
            <input
              type="date"
              placeholder="Type here"
              className="input input-sm w-full max-w-xs"
              value={paycheckPeriodEnd}
              onChange={(e) => setPaycheckPeriodEnd(e.target.value)}
            />
          </fieldset>
        </div>

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
                  className="select select-sm col-span-2"
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
                  className="input input-sm col-span-2"
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
          <div className="flex flex-col max-h-80 border border-base-content/20 rounded-md px-4 py-2 overflow-auto">
            <ExportFilterComponent
              field={EmployeeFilterField.USERNAME}
              label="Username"
              type={FilterType.STRING_FILTER}
              setFilterField={setFilterUsername}
            />
            <ExportFilterComponent
              field={EmployeeFilterField.M_NR}
              label="M-Nr"
              type={FilterType.OBJECT_FILTER}
              setFilterField={setFilterMnr}
            />
            <ExportFilterComponent
              field={EmployeeFilterField.ROLE}
              label="Role"
              type={FilterType.OBJECT_FILTER}
              setFilterField={setFilterRole}
            />
            <ExportFilterComponent
              field={EmployeeFilterField.DEPARTMENT}
              label="Department"
              type={FilterType.STRING_FILTER}
              setFilterField={setFilterDepartment}
            />
            <ExportFilterComponent
              field={EmployeeFilterField.INITIALS}
              label="Initials"
              type={FilterType.STRING_FILTER}
              setFilterField={setFilterInitials}
            />
            <ExportFilterComponent
              field={EmployeeFilterField.EMPLOYER_VAT_ID}
              label="Employer VAT ID"
              type={FilterType.STRING_FILTER}
              setFilterField={setFilterEmployerVatID}
            />
            <ExportFilterComponent
              field={EmployeeFilterField.EMPLOYEE_LINK}
              label="Employee Link"
              type={FilterType.STRING_FILTER}
              setFilterField={setFilterEmployeeLink}
            />
            <ExportFilterComponent
              field={EmployeeFilterField.EMPLOYMENT_START_DATE}
              label="Employment Start Date"
              type={FilterType.COMPARIBLE_FILTER}
              setFilterField={setFilterEmploymentStartDate}
            />
            <ExportFilterComponent
              field={EmployeeFilterField.EMPLOYMENT_END_DATE}
              label="Employment End Date"
              type={FilterType.COMPARIBLE_FILTER}
              setFilterField={setFilterEmploymentEndDate}
            />
            <ExportFilterComponent
              field={EmployeeFilterField.SALARY_TYPE}
              label="Salary Type"
              type={FilterType.OBJECT_FILTER}
              setFilterField={setFilterSalaryType}
            />
            <ExportFilterComponent
              field={EmployeeFilterField.HOURLY_RATE}
              label="Hourly Rate"
              type={FilterType.COMPARIBLE_FILTER}
              setFilterField={setFilterHourlyRate}
            />
            <ExportFilterComponent
              field={EmployeeFilterField.HOURS_WORKED}
              label="Hours Worked"
              type={FilterType.COMPARIBLE_FILTER}
              setFilterField={setFilterHoursWorked}
            />
            <ExportFilterComponent
              field={EmployeeFilterField.POINTS_EARNED}
              label="Points Earned"
              type={FilterType.COMPARIBLE_FILTER}
              setFilterField={setFilterPointsEeaned}
            />
            <ExportFilterComponent
              field={EmployeeFilterField.SALARY}
              label="Salary"
              type={FilterType.COMPARIBLE_FILTER}
              setFilterField={setFilterSalary}
            />
            <ExportFilterComponent
              field={EmployeeFilterField.BONUS}
              label="Bonus"
              type={FilterType.COMPARIBLE_FILTER}
              setFilterField={setFilterBonus}
            />
            <ExportFilterComponent
              field={EmployeeFilterField.DEDUCTION}
              label="Deduction"
              type={FilterType.COMPARIBLE_FILTER}
              setFilterField={setFilterDeduction}
            />
            <ExportFilterComponent
              field={EmployeeFilterField.TAGS}
              label="Tags"
              type={FilterType.LIST_FILTER}
              setFilterField={setFilterTags}
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
              className="select select-sm w-full"
              value={exportRule}
              onChange={(e) => setExportRule(e.target.value)}
            >
              <option value="">Not Selected</option>
              {ruleCodes?.map((key) => (
                <option key={key} value={key}>{lookupValue(ruleMappings, key)}</option>
              ))}
            </select>
            <textarea
              className="textarea text-xs resize-none font-mono grow w-full"
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
              {
                previewLoading
                  ? <span className="loading loading-spinner loading-xs"></span>
                  : <FontAwesomeIcon icon={faRefresh} width={12} />
              }
              Refresh
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
