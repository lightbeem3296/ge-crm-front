import { getRoleMappings } from "@/services/roleService";
import { getSalaryTypeMappings } from "@/services/salaryTypeService";
import { getTagMappings } from "@/services/tagService";
import { ComparableFilterCondition, comparableFilterConditionCodes, comparableFilterConditionMappings, EmployeeFilterField, FilterType, objectFilterConditionCodes, objectFilterConditionMappings, stringFilterConditionCodes, stringFilterConditionMappings } from "@/types/filter";
import { extractKeys, lookupValue } from "@/utils/record";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface FilterComponentProps {
  field: EmployeeFilterField
  label: string,
  type: FilterType,
  setFilterField: Dispatch<SetStateAction<any>> // eslint-disable-line
}

const tagMappings = await getTagMappings();
const roleMappings = await getRoleMappings();
const roleCodes = extractKeys(roleMappings);

const salaryTypeMappings = await getSalaryTypeMappings();
const salaryTypeCodes = extractKeys(salaryTypeMappings);

export default function ExportFilterComponent({ field, label, type, setFilterField }: FilterComponentProps) {
  const [filterValue, setFilterValue] = useState<string>("");
  const [filterValues, setFilterValues] = useState<string[]>([]);
  const [filterCondition, setFilterCondition] = useState<string>("");
  const [filterCaseSensitive, setFilterCaseSensitive] = useState<boolean>(false);

  const isDateField = field === EmployeeFilterField.EMPLOYMENT_START_DATE || field === EmployeeFilterField.EMPLOYMENT_END_DATE;
  const is2values = () => {
    return [
      ComparableFilterCondition.GTE_LT.toString(),
      ComparableFilterCondition.GTE_LTE.toString(),
      ComparableFilterCondition.GT_LT.toString(),
      ComparableFilterCondition.GT_LTE.toString(),
    ].includes(filterCondition);
  }

  // UI Handlers
  const handleChangeFilterCondition = (value: string) => {
    setFilterCondition(value);
  }

  const handleChangeCaseSensitive = (value: boolean) => {
    setFilterCaseSensitive(value);
  }

  const handleChangeFilterValue = (value: string) => {
    setFilterValue(value);
  }

  const handleChangeFilterValues = (value: [string?, string?]) => {
    setFilterValues([
      value[0] || filterValues[0],
      value[1] || filterValues[1],
    ]);
  }

  const handleChangeTags = (value: string, checked: boolean) => {
    if (checked) {
      filterValues.push(value);
    } else {
      const index = filterValues.indexOf(value);
      if (index > -1) {
        filterValues.splice(index, 1);
      }
    }
    setFilterValues([...filterValues]);
  }

  // Hooks
  useEffect(() => {
    if (filterCondition === "") {
      setFilterField(undefined);
      return;
    }
    if ((type === FilterType.OBJECT_FILTER || type === FilterType.STRING_FILTER) && filterValue === "") {
      setFilterField(undefined);
      return;
    }
    if (type === FilterType.COMPARIBLE_FILTER) {
      if (is2values()) {
        if (filterValues[0] === "" || filterValues[1] === "") {
          setFilterField(undefined);
          return;
        }
      } else {
        if (filterValue === "") {
          setFilterField(undefined);
          return;
        }
      }
    }

    if (type === FilterType.OBJECT_FILTER) {
      setFilterField({
        value: filterValue,
        condition: filterCondition,
      });
    } else if (type === FilterType.STRING_FILTER) {
      setFilterField({
        value: filterValue,
        condition: filterCondition,
        case_sensitive: filterCaseSensitive,
      });
    } else if (type === FilterType.COMPARIBLE_FILTER) {
      if ([
        ComparableFilterCondition.GTE_LT.toString(),
        ComparableFilterCondition.GTE_LTE.toString(),
        ComparableFilterCondition.GT_LT.toString(),
        ComparableFilterCondition.GT_LTE.toString(),
      ].includes(filterCondition)) {
        setFilterField({
          value: filterValues,
          condition: filterCondition,
        });
      } else {
        setFilterField({
          value: filterValue,
          condition: filterCondition,
        });
      }
    } else if (type === FilterType.LIST_FILTER) {
      setFilterField({
        value: filterValues,
        condition: filterCondition,
      });
    }
  }, [filterValue, filterValues, filterCondition, filterCaseSensitive]); // eslint-disable-line

  return (
    <fieldset className="fieldset">
      <label className="fieldset-legend">{label}</label>
      <div className="flex flex-col gap-2">

        {/* Select Condition */}
        <select
          className="select select-bordered select-sm w-full"
          value={filterCondition}
          onChange={(e) => handleChangeFilterCondition(e.target.value)}
        >
          <option value="">Not Selected</option>
          {
            type === FilterType.STRING_FILTER
              ? stringFilterConditionCodes.map((key) => (
                <option key={key} value={key}>{lookupValue(stringFilterConditionMappings, key)}</option>
              ))
              : type === FilterType.OBJECT_FILTER
                ? objectFilterConditionCodes.map((key) => (
                  <option key={key} value={key}>{lookupValue(objectFilterConditionMappings, key)}</option>
                ))
                : type === FilterType.COMPARIBLE_FILTER
                  ? comparableFilterConditionCodes.map((key) => (
                    <option key={key} value={key}>{lookupValue(comparableFilterConditionMappings, key)}</option>
                  ))
                  : type === FilterType.LIST_FILTER
                    ? <>
                      <option value="all">Contains All</option>
                      <option value="any">Contains Any</option>
                    </>
                    : null
          }
        </select>

        {/* Input Value */}
        {
          filterCondition !== ""

            // String Filter
            ? type === FilterType.STRING_FILTER
              ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    className="input input-sm input-bordered w-full"
                    onChange={(e) => handleChangeFilterValue(e.target.value)}
                  />
                  <fieldset className="fieldset">
                    <label className="fieldset-label">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs checkbox-primary"
                        checked={filterCaseSensitive}
                        onChange={(e) => handleChangeCaseSensitive(e.target.checked)}
                      />
                      Case Sensitive
                    </label>
                  </fieldset>
                </div>
              )

              // List Filter
              : type === FilterType.LIST_FILTER
                ? extractKeys(tagMappings).map((key, index) => (
                  <label key={index} className="fieldset-label">
                    <input
                      key={index}
                      type="checkbox"
                      className="checkbox checkbox-xs checkbox-primary"
                      defaultChecked={filterValue.includes(key)}
                      onChange={(e) => handleChangeTags(key, e.target.checked)}
                    />
                    {lookupValue(tagMappings, key)}
                  </label>
                ))

                // Object Filter
                : type === FilterType.OBJECT_FILTER

                  // Role Filter
                  ? field === EmployeeFilterField.ROLE
                    ? <select
                      className="select select-bordered select-sm"
                      value={filterValue}
                      onChange={(e) => handleChangeFilterValue(e.target.value)}
                    >
                      <option value="">Not Selected</option>
                      {roleCodes.map((key) => (
                        <option key={key} value={key}>{lookupValue(roleMappings, key)}</option>
                      ))}
                    </select>

                    // Salary Type Filter
                    : field === EmployeeFilterField.SALARY_TYPE
                      ? <select
                        className="select select-bordered select-sm"
                        value={filterValue}
                        onChange={(e) => handleChangeFilterValue(e.target.value)}
                      >
                        <option value="">Not Selected</option>
                        {salaryTypeCodes.map((key) => (
                          <option key={key} value={key}>{lookupValue(salaryTypeMappings, key)}</option>
                        ))}
                      </select>

                      // General String Object Filter
                      : <input
                        type="text"
                        className="input input-sm input-bordered w-full"
                        onChange={(e) => handleChangeFilterValue(e.target.value)}
                      />

                  // Comparable Filter
                  : type === FilterType.COMPARIBLE_FILTER

                    // Two Value Type Filter
                    ? is2values()
                      ? (
                        <div className="flex flex-col gap-2">
                          <input
                            type={isDateField ? "date" : "text"}
                            className="input input-sm input-bordered w-full"
                            onChange={(e) => handleChangeFilterValues([e.target.value, undefined])}
                          />
                          <input
                            type={isDateField ? "date" : "text"}
                            className="input input-sm input-bordered w-full"
                            onChange={(e) => handleChangeFilterValues([undefined, e.target.value])}
                          />
                        </div>
                      )

                      // Single Value Type Filter
                      : <input
                        type={isDateField ? "date" : "text"}
                        className="input input-sm input-bordered w-full"
                        onChange={(e) => handleChangeFilterValue(e.target.value)}
                      />
                    : null
            : null
        }
      </div>
    </fieldset>
  );
}
