"use client";

import { customAlert, CustomAlertType } from "@/components/ui/alert";
import RuleFilterComponent from "@/components/ui/rule/Filter";
import { axiosHelper } from "@/lib/axios";
import { getRoleMappings } from "@/services/roleService";
import { ApiGeneralResponse } from "@/types/api";
import { RuleRowData } from "@/types/datatable";
import { ComparableFilterCondition, EmployeeFilterField, FilterType, ObjectFilterCondition } from "@/types/filter";
import { RuleActionField, ruleActionFieldCodes, ruleActionFieldMap, RuleActionOperator, ruleActionOperatorCodes, ruleActionOperatorMap } from "@/types/rule/action";
import { RuleConditionCombinator, ruleConditionCombinatorCodes, ruleConditionCombinatorMap } from "@/types/rule/condition";
import { RuleEditPageMode } from "@/types/rule/edit";
import { extractKeys, lookupValue } from "@/utils/record";
import { faArrowLeft, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const roleMappings = await getRoleMappings();
const roleCodes = extractKeys(roleMappings);

function RuleEditPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentRuleIndex, setCurrentRuleIndex] = useState<number>(0);
  const [actionValues, setActionValues] = useState<string[]>([]);

  const modeFromParams = searchParams?.get("mode");
  const pageMode = Object.values(RuleEditPageMode).includes(modeFromParams as RuleEditPageMode) ? modeFromParams : RuleEditPageMode.EDIT;
  const id = searchParams?.get("id");

  const [rule, setRule] = useState<RuleRowData>({
    rule_name: "New Rule",
    description: "This is a new Rule.",
    atom_rules: [
      {
        rule_name: "New Atom Rule",
        condition: {
          combinator: RuleConditionCombinator.NONE,
          conditions: [
            {
              condition_name: "Role",
              filter: {},
            }
          ],
        },
        action: {
          field: RuleActionField.SALARY,
          operator: RuleActionOperator.MULTIPLY,
          value: 1.5,
        },
      },
    ],
  });

  const fetchRule = async () => {
    const response = await axiosHelper.get<RuleRowData>(`/rule/get/${id}`);
    if (response) {
      setRule(response);
      setActionValues(response.atom_rules.map((atom_rule) => atom_rule.action.value.toString()));
    }
  }

  const [display, setDisplay] = useState<string>();

  // UI Handlers
  const handleClickBack = () => {
    router.push("/main/data/rule");
  }

  const handleChangeRuleName = (value: string) => {
    setRule({
      ...rule,
      rule_name: value,
    });
  }

  const handleChangeDescription = (value: string) => {
    setRule({
      ...rule,
      description: value,
    })
  }

  const handleClickNewAtomRule = () => {
    setRule({
      ...rule,
      atom_rules: [
        ...rule.atom_rules,
        {
          rule_name: "New Atom Rule",
          condition: {
            combinator: RuleConditionCombinator.NONE,
            conditions: [
              {
                condition_name: "New Atom Condition",
                filter: {
                  hours_worked: {
                    value: "40.0",
                    condition: ComparableFilterCondition.GT,
                  }
                }
              }
            ],
          },
          action: {
            field: RuleActionField.SALARY,
            operator: RuleActionOperator.MULTIPLY,
            value: 1.5,
          },
        },
      ]
    });
  }

  const handleChangeAtomRuleName = (rule_index: number, value: string) => {
    setRule({
      ...rule,
      atom_rules: rule.atom_rules.map((atom_rule, r_index) =>
        r_index === rule_index
          ? {
            ...atom_rule,
            rule_name: value,
          }
          : atom_rule
      ),
    });
  }

  const handleClickDeleteAtomRule = (rule_index: number) => {
    setRule({
      ...rule,
      atom_rules: rule.atom_rules.filter((atom_rule, r_index) => r_index !== rule_index),
    });
  }

  const handleClickNewAtomCondition = (rule_index: number) => {
    setRule({
      ...rule,
      atom_rules: rule.atom_rules.map((atom_rule, r_index) =>
        r_index === rule_index
          ? {
            ...atom_rule,
            condition: {
              ...atom_rule.condition,
              combinator: atom_rule.condition.combinator === RuleConditionCombinator.NONE || atom_rule.condition.combinator === RuleConditionCombinator.NOT
                ? RuleConditionCombinator.AND
                : atom_rule.condition.combinator,
              conditions: [
                ...atom_rule.condition.conditions,
                {
                  condition_name: "New Atom Condition",
                  filter: {
                    role: {
                      value: roleCodes[0],
                      condition: ObjectFilterCondition.EQ,
                    }
                  }
                },
              ],
            },
          }
          : atom_rule
      ),
    });
  };

  const handleChangeAtomConditionName = (rule_index: number, condition_index: number, value: string) => {
    setRule({
      ...rule,
      atom_rules: rule.atom_rules.map((atom_rule, r_index) =>
        r_index === rule_index
          ? {
            ...atom_rule,
            condition: {
              ...atom_rule.condition,
              conditions: atom_rule.condition.conditions.map((atom_condition, c_index) =>
                c_index === condition_index
                  ? {
                    ...atom_condition,
                    condition_name: value,
                  }
                  : atom_condition
              ),
            },
          }
          : atom_rule
      ),
    });
  }

  const handleChangeConditionCombinator = (rule_index: number, value: string) => {
    setRule({
      ...rule,
      atom_rules: rule.atom_rules.map((atom_rule, r_index) =>
        r_index === rule_index
          ? {
            ...atom_rule,
            condition: {
              ...atom_rule.condition,
              combinator: value,
            },
          }
          : atom_rule
      ),
    });
  }

  const handleClickDeleteAtomCondition = (rule_index: number, condition_index: number) => {
    setRule({
      ...rule,
      atom_rules: rule.atom_rules.map((atom_rule, r_index) =>
        r_index === rule_index
          ? {
            ...atom_rule,
            condition: {
              ...atom_rule.condition,
              conditions: [
                ...atom_rule.condition.conditions.filter((c, i) => i !== condition_index),
              ],
            },
          }
          : atom_rule
      ),
    });
  };

  const handleChangeActionField = (rule_index: number, value: string) => {
    setRule({
      ...rule,
      atom_rules: rule.atom_rules.map((atom_rule, r_index) =>
        r_index === rule_index
          ? {
            ...atom_rule,
            action: {
              ...atom_rule.action,
              field: value,
            },
          }
          : atom_rule
      ),
    });
  }

  const handleChangeActionOperator = (rule_index: number, value: string) => {
    setRule({
      ...rule,
      atom_rules: rule.atom_rules.map((atom_rule, r_index) =>
        r_index === rule_index
          ? {
            ...atom_rule,
            action: {
              ...atom_rule.action,
              operator: value,
            },
          }
          : atom_rule
      ),
    });
  }

  const handleSave = async () => {
    if (pageMode === RuleEditPageMode.CREATE) {
      const response = await axiosHelper.post<RuleRowData, ApiGeneralResponse>(`/rule/create`, rule, undefined);
      if (response) {
        setRule({
          ...rule,
          _id: response.detail.object_id,
        });
        router.push("/main/data/rule");

        customAlert({
          type: CustomAlertType.SUCCESS,
          message: "Created successfully.",
        });
      }
    } else if (pageMode === RuleEditPageMode.EDIT) {
      const response = await axiosHelper.put<RuleRowData, ApiGeneralResponse>(`/rule/update/${rule._id}`, rule);
      if (response) {
        customAlert({
          type: CustomAlertType.SUCCESS,
          message: "Updated successfully.",
        });
      }
    } else {
      customAlert({
        type: CustomAlertType.ERROR,
        title: "URL Error",
        message: `Unhandled mode: ${pageMode}`,
      });
    }
  }

  // Data functions
  const updateDisplay = async () => {
    let display = "";
    if (rule.atom_rules.length == 0) {
      display = "# NO RULES";
    } else {
      let conditions_valid = true;
      for (let i = 0; i < rule.atom_rules.length; i++) {
        const atom_rule = rule.atom_rules[i];
        if (atom_rule.condition.conditions.length == 0) {
          display = `# NO CONDITIONS FOR ${i + 1}-th RULE`;
          conditions_valid = false;
          break;
        }
      }
      if (conditions_valid) {
        const response = await axiosHelper.post<RuleRowData, string>("/rule/display", rule);
        if (response) {
          display = response;
        } else {
          display = "# SERVER ERROR";
        }
      }
    }
    setDisplay(display);
  }

  // Hooks
  useEffect(() => {
    if (pageMode !== RuleEditPageMode.CREATE) {
      fetchRule();
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    const currentActionValue = actionValues[currentRuleIndex];
    const num_value = parseFloat(currentActionValue);
    if (isNaN(num_value)) {
      return;
    }
    setRule({
      ...rule,
      atom_rules: rule.atom_rules.map((atom_rule, r_index) =>
        r_index === currentRuleIndex
          ? {
            ...atom_rule,
            action: {
              ...atom_rule.action,
              value: num_value,
            },
          }
          : atom_rule
      ),
    });
  }, [currentRuleIndex, actionValues]); // eslint-disable-line

  useEffect(() => {
    updateDisplay();
  }, [rule]); // eslint-disable-line

  useEffect(() => {
    setActionValues(rule.atom_rules.map((atom_rule) => atom_rule.action.value.toString()));
  }, [rule.atom_rules.length]); // eslint-disable-line

  return (
    <div>
      <div className="flex justify-between px-2 py-4">
        <p className="text-lg font-medium text-base-content/80">
          {
            pageMode === RuleEditPageMode.CREATE
              ? "Create New Rule"
              : pageMode === RuleEditPageMode.EDIT
                ? "Edit Rule"
                : "View Rule"
          }
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="btn btn-info btn-sm text-gray-100"
            onClick={() => handleClickBack()}
          >
            <FontAwesomeIcon icon={faArrowLeft} width={12} /> Back to Rules
          </button>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-2 h-fit md:h-[calc(100vh-10.6rem)]">
        <div className="col-span-6 md:col-span-4 flex flex-col gap-2 p-4 w-full h-fit md:max-h-[calc(100vh-10.6rem)] overflow-auto border border-base-content/20 rounded-md">

          {/* Rulename */}
          <div className="">
            <label htmlFor="rule-name" className="block text-sm font-medium text-base-content">Rule name</label>
            <div className="mt-2">
              <input
                type="text"
                id="rule-name"
                name="rule-name"
                className="input input-bordered input-sm w-full"
                value={rule.rule_name}
                onChange={(e) => handleChangeRuleName(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="">
            <label htmlFor="description" className="block text-sm font-medium text-base-content">Description</label>
            <div className="mt-2">
              <input
                type="text"
                id="description"
                name="description"
                className="input input-bordered input-sm w-full"
                value={rule.description}
                onChange={(e) => handleChangeDescription(e.target.value)}
              />
            </div>
          </div>

          {/* New Atom Rule Button */}
          <div className="mt-4">
            <button
              className="btn btn-primary btn-sm btn-outline"
              onClick={() => handleClickNewAtomRule()}
            >
              <FontAwesomeIcon icon={faPlus} width={12} />Add Atom Rule
            </button>
          </div>

          {/* Edit Rule */}
          <div className="join join-vertical rounded-md">
            {rule.atom_rules.map((atomRule, ruleIndex) => (
              // Atom Rules
              <div key={ruleIndex} className="collapse collapse-arrow join-item border border-base-content/20">
                <input type="checkbox" className="peer" defaultChecked={ruleIndex === 0} />
                <div className="collapse-title font-medium">Atom Rule {ruleIndex + 1}: {atomRule.rule_name}</div>
                <div className="collapse-content">
                  <div className="w-full grid grid-cols-6 gap-2">

                    {/* Rule Name */}
                    <div className="col-span-6">
                      <label htmlFor={`atom_rule_name`} className="block text-sm font-medium text-base-content">Name</label>
                      <div className="mt-2">
                        <input
                          type="text"
                          id={`atom_rule_name`}
                          name={`atom_rule_name`}
                          className="input input-bordered input-sm"
                          value={atomRule.rule_name}
                          onChange={(e) => handleChangeAtomRuleName(ruleIndex, e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Condition */}
                    <div className="col-span-6 sm:col-span-4 flex flex-col gap-2 border border-base-content/20 rounded-lg p-2">
                      <div className="text-sm font-medium p-2 border-b border-base-content/20">Condition</div>

                      <div className="w-full flex flex-col gap-2">

                        {/* Combinator */}
                        <fieldset className="fieldset">
                          <legend className="fieldset-legend">Combinator</legend>
                          <select
                            className="select select-bordered select-sm"
                            value={atomRule.condition.combinator}
                            onChange={(e) => handleChangeConditionCombinator(ruleIndex, e.target.value)}
                          >
                            <option disabled value="">Select an operator</option>
                            {ruleConditionCombinatorCodes.map((key) => (
                              <option key={key} value={key} disabled={atomRule.condition.conditions.length > 1 && (key === RuleConditionCombinator.NONE || key === RuleConditionCombinator.NOT)}>
                                {lookupValue(ruleConditionCombinatorMap, key)}
                              </option>
                            ))}
                          </select>
                        </fieldset>

                        {/* New Atom Condition Button */}
                        <div className="flex place-items-end mt-4">
                          <button
                            className="btn btn-sm btn-primary btn-outline"
                            onClick={() => handleClickNewAtomCondition(ruleIndex)}
                          >
                            <FontAwesomeIcon icon={faPlus} width={12} />Add Atom Condition
                          </button>
                        </div>
                      </div>

                      {/* Atom Conditions */}
                      <div className="join join-vertical w-full border border-base-content/20">
                        {atomRule.condition.conditions.map((atomCondition, conditionIndex) => (
                          <div key={conditionIndex} className={`join-item collapse collapse-arrow ${conditionIndex !== 0 ? "border-t" : ""} border-base-content/20`}>
                            <input type="checkbox" className="peer" />
                            <div className="collapse-title font-medium ">Atom Contition {conditionIndex + 1}: {atomCondition.condition_name}</div>
                            <div className="collapse-content">
                              <div className="flex flex-col gap-2">

                                {/* Condition Name */}
                                <fieldset className="fieldset col-span-6 border-b border-base-content/20 pb-2">
                                  <legend className="fieldset-legend">Name</legend>
                                  <input
                                    type="text"
                                    id={`atom_rule_name`}
                                    name={`atom_rule_name`}
                                    className="input input-bordered input-sm"
                                    value={atomCondition.condition_name}
                                    onChange={(e) => handleChangeAtomConditionName(ruleIndex, conditionIndex, e.target.value)}
                                  />
                                </fieldset>

                                {/* Filters */}
                                <div className="flex flex-col">
                                  <RuleFilterComponent
                                    field={EmployeeFilterField.USERNAME}
                                    label="Username"
                                    type={FilterType.STRING_FILTER}
                                    ruleIndex={ruleIndex}
                                    conditionIndex={conditionIndex}
                                    rule={rule}
                                    setRule={setRule}
                                  />
                                  <RuleFilterComponent
                                    field={EmployeeFilterField.M_NR}
                                    label="M-Nr"
                                    type={FilterType.OBJECT_FILTER}
                                    ruleIndex={ruleIndex}
                                    conditionIndex={conditionIndex}
                                    rule={rule}
                                    setRule={setRule}
                                  />
                                  <RuleFilterComponent
                                    field={EmployeeFilterField.ROLE}
                                    label="Role"
                                    type={FilterType.OBJECT_FILTER}
                                    ruleIndex={ruleIndex}
                                    conditionIndex={conditionIndex}
                                    rule={rule}
                                    setRule={setRule}
                                  />
                                  <RuleFilterComponent
                                    field={EmployeeFilterField.DEPARTMENT}
                                    label="Department"
                                    type={FilterType.STRING_FILTER}
                                    ruleIndex={ruleIndex}
                                    conditionIndex={conditionIndex}
                                    rule={rule}
                                    setRule={setRule}
                                  />
                                  <RuleFilterComponent
                                    field={EmployeeFilterField.INITIALS}
                                    label="Initials"
                                    type={FilterType.STRING_FILTER}
                                    ruleIndex={ruleIndex}
                                    conditionIndex={conditionIndex}
                                    rule={rule}
                                    setRule={setRule}
                                  />
                                  <RuleFilterComponent
                                    field={EmployeeFilterField.EMPLOYER_VAT_ID}
                                    label="Employer VAT ID"
                                    type={FilterType.STRING_FILTER}
                                    ruleIndex={ruleIndex}
                                    conditionIndex={conditionIndex}
                                    rule={rule}
                                    setRule={setRule}
                                  />
                                  <RuleFilterComponent
                                    field={EmployeeFilterField.EMPLOYEE_LINK}
                                    label="Employee Link"
                                    type={FilterType.STRING_FILTER}
                                    ruleIndex={ruleIndex}
                                    conditionIndex={conditionIndex}
                                    rule={rule}
                                    setRule={setRule}
                                  />
                                  <RuleFilterComponent
                                    field={EmployeeFilterField.EMPLOYMENT_START_DATE}
                                    label="Employment Start Date"
                                    type={FilterType.COMPARIBLE_FILTER}
                                    ruleIndex={ruleIndex}
                                    conditionIndex={conditionIndex}
                                    rule={rule}
                                    setRule={setRule}
                                  />
                                  <RuleFilterComponent
                                    field={EmployeeFilterField.EMPLOYMENT_END_DATE}
                                    label="Employment End Date"
                                    type={FilterType.COMPARIBLE_FILTER}
                                    ruleIndex={ruleIndex}
                                    conditionIndex={conditionIndex}
                                    rule={rule}
                                    setRule={setRule}
                                  />
                                  <RuleFilterComponent
                                    field={EmployeeFilterField.SALARY_TYPE}
                                    label="Salary Type"
                                    type={FilterType.OBJECT_FILTER}
                                    ruleIndex={ruleIndex}
                                    conditionIndex={conditionIndex}
                                    rule={rule}
                                    setRule={setRule}
                                  />
                                  <RuleFilterComponent
                                    field={EmployeeFilterField.HOURLY_RATE}
                                    label="Hourly Rate"
                                    type={FilterType.COMPARIBLE_FILTER}
                                    ruleIndex={ruleIndex}
                                    conditionIndex={conditionIndex}
                                    rule={rule}
                                    setRule={setRule}
                                  />
                                  <RuleFilterComponent
                                    field={EmployeeFilterField.HOURS_WORKED}
                                    label="Hours Worked"
                                    type={FilterType.COMPARIBLE_FILTER}
                                    ruleIndex={ruleIndex}
                                    conditionIndex={conditionIndex}
                                    rule={rule}
                                    setRule={setRule}
                                  />
                                  <RuleFilterComponent
                                    field={EmployeeFilterField.POINTS_EARNED}
                                    label="Points Earned"
                                    type={FilterType.COMPARIBLE_FILTER}
                                    ruleIndex={ruleIndex}
                                    conditionIndex={conditionIndex}
                                    rule={rule}
                                    setRule={setRule}
                                  />
                                  <RuleFilterComponent
                                    field={EmployeeFilterField.SALARY}
                                    label="Salary"
                                    type={FilterType.COMPARIBLE_FILTER}
                                    ruleIndex={ruleIndex}
                                    conditionIndex={conditionIndex}
                                    rule={rule}
                                    setRule={setRule}
                                  />
                                  <RuleFilterComponent
                                    field={EmployeeFilterField.BONUS}
                                    label="Bonus"
                                    type={FilterType.COMPARIBLE_FILTER}
                                    ruleIndex={ruleIndex}
                                    conditionIndex={conditionIndex}
                                    rule={rule}
                                    setRule={setRule}
                                  />
                                  <RuleFilterComponent
                                    field={EmployeeFilterField.DEDUCTION}
                                    label="Deduction"
                                    type={FilterType.COMPARIBLE_FILTER}
                                    ruleIndex={ruleIndex}
                                    conditionIndex={conditionIndex}
                                    rule={rule}
                                    setRule={setRule}
                                  />
                                  <RuleFilterComponent
                                    field={EmployeeFilterField.TAGS}
                                    label="Tags"
                                    type={FilterType.LIST_FILTER}
                                    ruleIndex={ruleIndex}
                                    conditionIndex={conditionIndex}
                                    rule={rule}
                                    setRule={setRule}
                                  />
                                </div>

                                {/* Delete Button */}
                                <div className="col-span-6 flex justify-end">
                                  <button
                                    className="btn btn-sm btn-error btn-outline"
                                    onClick={() => { handleClickDeleteAtomCondition(ruleIndex, conditionIndex) }}
                                  >
                                    <FontAwesomeIcon icon={faTrash} width={12} />Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="col-span-6 sm:col-span-2 flex flex-col gap-2 border border-base-content/20 rounded-lg p-2">
                      <div className="text-sm font-medium p-2 border-b border-base-content/20">Action</div>

                      {/* Action Field */}
                      <label className="form-control w-full">
                        <div className="label">
                          <span className="label-text">Field</span>
                        </div>
                        <select
                          className="select select-bordered select-sm"
                          value={atomRule.action.field}
                          onChange={(e) => handleChangeActionField(ruleIndex, e.target.value)}
                        >
                          <option disabled value="">Select a field</option>
                          {ruleActionFieldCodes.map((key) => (
                            <option key={key} value={key}>
                              {lookupValue(ruleActionFieldMap, key)}
                            </option>
                          ))}
                        </select>
                      </label>

                      {/* Action Operator */}
                      <label className="form-control w-full">
                        <div className="label">
                          <span className="label-text">Operator</span>
                        </div>
                        <select
                          className="select select-bordered select-sm"
                          value={atomRule.action.operator}
                          onChange={(e) => handleChangeActionOperator(ruleIndex, e.target.value)}
                        >
                          <option disabled value="">Select an operator</option>
                          {ruleActionOperatorCodes.map((key) => (
                            <option key={key} value={key}>
                              {lookupValue(ruleActionOperatorMap, key)}
                            </option>
                          ))}
                        </select>
                      </label>

                      {/* Action Value */}
                      <label className="form-control w-full">
                        <div className="label">
                          <span className="label-text">Value</span>
                        </div>
                        <input
                          type="text"
                          className="input input-bordered w-full input-sm"
                          value={actionValues.length > ruleIndex ? actionValues[ruleIndex] : "0.0"}
                          onChange={(e) => {
                            setCurrentRuleIndex(ruleIndex);
                            setActionValues(prev => {
                              const newActionValues = [...prev];
                              newActionValues[ruleIndex] = e.target.value;
                              return newActionValues;
                            });
                          }}
                        />
                      </label>
                    </div>

                    {/* Delete Button */}
                    <div className="col-span-6 flex justify-end gap-2 p-2">
                      <button
                        className="btn btn-sm btn-error btn-outline"
                        onClick={(e) => handleClickDeleteAtomRule(ruleIndex)} // eslint-disable-line
                      >
                        <FontAwesomeIcon icon={faTrash} width={12} />Delete Atom Rule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Display */}
        <div className="col-span-6 md:col-span-2 flex flex-col justify-between border border-base-content/20 rounded-md p-4">
          <div className="grow overflow-auto">
            <label htmlFor="display" className="block text-sm font-medium text-base-content">Display</label>
            <textarea
              name="display"
              className="textarea textarea-bordered w-full text-xs font-mono font-medium mt-2 h-80 md:h-[calc(100%-2.5rem)] resize-none"
              value={display}
              readOnly />
          </div>
          <div className="mt-4 flex justify-end gap-x-2">
            <button
              className="btn btn-primary text-gray-100 px-8"
              onClick={handleSave}
            >
              <FontAwesomeIcon icon={faSave} width={12} /> Save
            </button>
          </div>
        </div>
      </div>
    </div >
  )
}

export default function RuleEditPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RuleEditPageContent />
    </Suspense>
  );
}
