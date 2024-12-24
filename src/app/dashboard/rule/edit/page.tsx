"use client";

import { RuleActionField, ruleActionFieldCodes, ruleActionFieldMap, RuleActionOperator, ruleActionOperatorCodes, ruleActionOperatorMap, RuleConditionCombinationOperator, ruleConditionCombinationOperatorCodes, ruleConditionCombinationOperatorMap, RuleConditionField, ruleConditionFieldCodes, ruleConditionFieldMap, RuleConditionNumberOperator, ruleConditionNumberOperatorCodes, ruleConditionNumberOperatorMap, ruleConditionObjectOperatorCodes, ruleConditionObjectOperatorMap, RuleRowData } from "@/types/datatable";
import { FormModeEnum } from "../page";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { axiosHelper } from "@/lib/axios";
import { ApiCrudResponse } from "@/types/api";
import { extractKeys, lookupValue } from "@/utils/record";
import { getRoleMappings } from "@/services/roleService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEdit, faHandPointLeft, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

const roleMappings = await getRoleMappings();
const roleCodes = extractKeys(roleMappings);

export default function RuleEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const formMode = searchParams.get("mode") || FormModeEnum.VIEW;
  const id = searchParams.get("id");

  console.log(formMode, FormModeEnum.VIEW, formMode === FormModeEnum.VIEW);

  const [rule, setRule] = useState<RuleRowData>({
    rule_name: "New Rule",
    description: "This is a new Rule.",
    atom_rules: [
      {
        condition: {
          combination: RuleConditionCombinationOperator.NONE,
          conditions: [
            {
              field: RuleConditionField.HOURS_WORKED,
              operator: RuleConditionNumberOperator.GTE,
              value: 40.0,
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
    const response = await axiosHelper.get<RuleRowData>(`/rule/${id}`);
    if (response) {
      setRule(response);
    } else {
      alert("fetch error");
    }
  }

  useEffect(() => {
    if (formMode !== FormModeEnum.CREATE) {
      fetchRule();
    }
  }, []);

  const [display, setDisplay] = useState<string>();

  // UI Handlers
  const handleClickBack = () => {
    router.push("/dashboard/rule");
  }

  const handleClickViewEdit = () => {
    router.push(`/dashboard/rule/edit?mode=${FormModeEnum.EDIT}&id=${id}`);
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
          condition: {
            combination: RuleConditionCombinationOperator.NONE,
            conditions: [
              {
                field: RuleConditionField.HOURS_WORKED,
                operator: RuleConditionNumberOperator.GTE,
                value: 40.0,
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
              combination: atom_rule.condition.combination === RuleConditionCombinationOperator.NONE || atom_rule.condition.combination === RuleConditionCombinationOperator.NOT
                ? RuleConditionCombinationOperator.AND
                : atom_rule.condition.combination,
              conditions: [
                ...atom_rule.condition.conditions,
                {
                  field: RuleConditionField.ROLE,
                  operator: RuleConditionNumberOperator.EQ,
                  value: roleCodes[0],
                },
              ],
            },
          }
          : atom_rule
      ),
    });
  };

  const handleChangeConditionCombination = (rule_index: number, value: string) => {
    setRule({
      ...rule,
      atom_rules: rule.atom_rules.map((atom_rule, r_index) =>
        r_index === rule_index
          ? {
            ...atom_rule,
            condition: {
              ...atom_rule.condition,
              combination: value,
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

  const handleChangeConditionField = (rule_index: number, condition_index: number, value: string) => {
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
                    field: value,
                    operator: value === RuleConditionField.ROLE ? ruleConditionObjectOperatorCodes[0] : ruleConditionNumberOperatorCodes[0],
                    value: value === RuleConditionField.ROLE ? roleCodes[0] : 1.0,
                  }
                  : atom_condition
              ),
            },
          }
          : atom_rule
      ),
    });
  }

  const handleChangeConditionOperator = (rule_index: number, condition_index: number, value: string) => {
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
                    operator: value,
                  }
                  : atom_condition
              ),
            },
          }
          : atom_rule
      ),
    });
  }

  const handleChangeConditionValue = (rule_index: number, condition_index: number, value: string) => {
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
                    value: value,
                  }
                  : atom_condition
              ),
            },
          }
          : atom_rule
      ),
    });
  }

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

  const handleChangeActionValue = (rule_index: number, str_value: string) => {
    const num_value = parseFloat(str_value);
    if (isNaN(num_value)) {
      alert("Invalid number format: " + str_value);
      return;
    } else {
      console.log(num_value);
    }
    setRule({
      ...rule,
      atom_rules: rule.atom_rules.map((atom_rule, r_index) =>
        r_index === rule_index
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
  }

  const handleSave = async () => {
    if (formMode === FormModeEnum.CREATE) {
      const response = await axiosHelper.post<RuleRowData, ApiCrudResponse>(`/rule`, rule, undefined, "Are you sure want to save?");
      if (response) {
        setRule({
          ...rule,
          _id: response.detail.object_id,
        });
      }
    } else if (formMode === FormModeEnum.EDIT) {
      const response = await axiosHelper.put<RuleRowData, ApiCrudResponse>(`/rule/${rule._id}`, rule, "Are you sure want to save?");
      if (response) {
      }
    } else {
      alert(`Unhandled form mode: ${formMode}`);
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
    updateDisplay();
  }, [rule]);

  return (
    <div>
      <div className="flex justify-between px-2 py-4">
        <p className="text-lg font-medium text-gray-700">
          {
            formMode === FormModeEnum.CREATE
              ? "Create New Rule"
              : formMode === FormModeEnum.EDIT
                ? "Edit Rule"
                : "View Rule"
          }
        </p>
        <div className="flex justify-end gap-2">
          <button
            className="btn btn-accent btn-sm"
            onClick={() => handleClickBack()}
          >
            <FontAwesomeIcon icon={faArrowLeft} width={12} /> Back to Rules
          </button>
          {formMode === FormModeEnum.VIEW
            ? (
              <button
                className="btn btn-info btn-sm"
                onClick={() => handleClickViewEdit()}
              >
                <FontAwesomeIcon icon={faEdit} width={12} /> Edit
              </button>
            )
            : null}
        </div>
      </div>
      <div className="grid grid-cols-6 gap-2 h-fit md:h-[calc(100vh-10.6rem)]">
        <div className="col-span-6 md:col-span-4 flex flex-col gap-2 p-4 w-full h-fit md:max-h-[calc(100vh-10.6rem)] overflow-auto border rounded-md">

          {/* Rulename */}
          <div className="">
            <label htmlFor="rule-name" className="block text-sm font-medium text-gray-900">Rule name</label>
            <div className="mt-2">
              <input
                type="text"
                id="rule-name"
                name="rule-name"
                className="input input-bordered input-sm w-full"
                value={rule.rule_name}
                onChange={(e) => handleChangeRuleName(e.target.value)}
                readOnly={formMode === FormModeEnum.VIEW} />
            </div>
          </div>

          {/* Description */}
          <div className="">
            <label htmlFor="description" className="block text-sm font-medium text-gray-900">Description</label>
            <div className="mt-2">
              <input
                type="text"
                id="description"
                name="description"
                className="input input-bordered input-sm w-full"
                value={rule.description}
                onChange={(e) => handleChangeDescription(e.target.value)}
                readOnly={formMode === FormModeEnum.VIEW} />
            </div>
          </div>

          {/* New Atom Rule Button */}
          <div className={`mt-4 ${formMode === FormModeEnum.VIEW ? "hidden" : ""}`}>
            <button
              className="btn btn-primary btn-sm btn-outline"
              onClick={() => handleClickNewAtomRule()}
            >
              <FontAwesomeIcon icon={faPlus} width={12} />Add Atom Rule
            </button>
          </div>

          {/* Edit Rule */}
          <div className="join join-vertical rounded-md">
            {formMode !== FormModeEnum.VIEW
              ? rule.atom_rules.map((atom_rule, rule_index) => (
                // Atom Rules
                <div key={rule_index} className="collapse collapse-arrow join-item border border-base-300">
                  <input type="checkbox" className="peer" />
                  <div className="collapse-title font-medium">Atom Rule {rule_index + 1}</div>
                  <div className="collapse-content">
                    <div className="w-full grid grid-cols-6 gap-2">

                      {/* Condition */}
                      <div className="col-span-6 sm:col-span-4 flex flex-col gap-2 border rounded-lg p-2">
                        <div className="text-sm font-medium p-2 border-b">Condition</div>

                        <div className="w-full flex flex-col gap-2">

                          {/* Combination */}
                          <label className="form-control">
                            <div className="label">
                              <span className="label-text">Combinator</span>
                            </div>
                            <select
                              className="select select-bordered select-sm"
                              value={atom_rule.condition.combination}
                              onChange={(e) => handleChangeConditionCombination(rule_index, e.target.value)}
                            >
                              <option disabled value="">Select an operator</option>
                              {ruleConditionCombinationOperatorCodes.map((key) => (
                                <option key={key} value={key} disabled={atom_rule.condition.conditions.length > 1 && (key === RuleConditionCombinationOperator.NONE || key === RuleConditionCombinationOperator.NOT)}>
                                  {lookupValue(ruleConditionCombinationOperatorMap, key)}
                                </option>
                              ))}
                            </select>
                          </label>

                          {/* New Atom Condition Button */}
                          <div className="flex place-items-end mt-4">
                            <button
                              className="btn btn-sm btn-primary btn-outline"
                              onClick={() => handleClickNewAtomCondition(rule_index)}
                            >
                              <FontAwesomeIcon icon={faPlus} width={12} />Add Atom Condition
                            </button>
                          </div>
                        </div>

                        {/* Atom Conditions */}
                        <div className="join join-vertical w-full border">
                          {atom_rule.condition.conditions.map((atom_condition, condition_index) => (
                            <div key={condition_index} className={`join-item collapse collapse-arrow ${condition_index !== 0 ? "border-t" : ""}`}>
                              <input type="checkbox" className="peer" />
                              <div className="collapse-title font-medium ">Atom Contition {condition_index + 1}</div>
                              <div className="collapse-content">
                                <div className="grid grid-cols-6 gap-2">

                                  {/* Condition Field */}
                                  <label className="form-control w-full col-span-6 sm:col-span-2">
                                    <div className="label">
                                      <span className="label-text">Field</span>
                                    </div>
                                    <select
                                      className="select select-bordered select-sm"
                                      value={atom_condition.field}
                                      onChange={(e) => handleChangeConditionField(rule_index, condition_index, e.target.value)}
                                    >
                                      <option disabled value="">Select a field</option>
                                      {ruleConditionFieldCodes.map((key) => (
                                        <option key={key} value={key}>
                                          {lookupValue(ruleConditionFieldMap, key)}
                                        </option>
                                      ))}
                                    </select>
                                  </label>

                                  {/* Condition Operator */}
                                  <label className="form-control w-full col-span-6 sm:col-span-2">
                                    <div className="label">
                                      <span className="label-text">Operator</span>
                                    </div>
                                    <select
                                      className="select select-bordered select-sm"
                                      value={atom_condition.operator}
                                      onChange={(e) => handleChangeConditionOperator(rule_index, condition_index, e.target.value)}
                                    >
                                      <option disabled value="">Select an operator</option>
                                      {atom_condition.field === RuleConditionField.ROLE
                                        ? ruleConditionObjectOperatorCodes.map((key) => (
                                          <option key={key} value={key}>
                                            {lookupValue(ruleConditionObjectOperatorMap, key)}
                                          </option>
                                        ))
                                        : ruleConditionNumberOperatorCodes.map((key) => (
                                          <option key={key} value={key}>
                                            {lookupValue(ruleConditionNumberOperatorMap, key)}
                                          </option>))
                                      }
                                    </select>
                                  </label>

                                  {/* Condition Value */}
                                  <label className="form-control w-full col-span-6 sm:col-span-2">
                                    <div className="label">
                                      <span className="label-text">Value</span>
                                    </div>
                                    {atom_condition.field === RuleConditionField.ROLE
                                      ? <select
                                        className="select select-bordered select-sm"
                                        value={atom_condition.value}
                                        onChange={(e) => handleChangeConditionValue(rule_index, condition_index, e.target.value)}
                                      >
                                        <option disabled value="">Select a value</option>
                                        {roleCodes.map((key) => (
                                          <option key={key} value={key}>
                                            {lookupValue(roleMappings, key)}
                                          </option>
                                        ))}
                                      </select>
                                      : <input
                                        type="text"
                                        className="input input-bordered w-full input-sm"
                                        value={atom_condition.value}
                                        onChange={(e) => handleChangeConditionValue(rule_index, condition_index, e.target.value)}
                                      />}
                                  </label>
                                  <div className="col-span-6 flex justify-end">
                                    <button
                                      className="btn btn-sm btn-error btn-outline"
                                      onClick={() => { handleClickDeleteAtomCondition(rule_index, condition_index) }}
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
                      <div className="col-span-6 sm:col-span-2 flex flex-col gap-2 border rounded-lg p-2">
                        <div className="text-sm font-medium p-2 border-b">Action</div>

                        {/* Action Field */}
                        <label className="form-control w-full">
                          <div className="label">
                            <span className="label-text">Field</span>
                          </div>
                          <select
                            className="select select-bordered select-sm"
                            value={atom_rule.action.field}
                            onChange={(e) => handleChangeActionField(rule_index, e.target.value)}
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
                            value={atom_rule.action.operator}
                            onChange={(e) => handleChangeActionOperator(rule_index, e.target.value)}
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
                            value={atom_rule.action.value}
                            onChange={(e) => handleChangeActionValue(rule_index, e.target.value)}
                          />
                        </label>
                      </div>

                      {/* Delete Button */}
                      <div className="col-span-6 flex justify-end gap-2 p-2">
                        <button
                          className="btn btn-sm btn-error btn-outline"
                          onClick={(e) => handleClickDeleteAtomRule(rule_index)}
                        >
                          <FontAwesomeIcon icon={faTrash} width={12} />Delete Atom Rule
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
              : null}
          </div>

        </div>

        {/* Display */}
        <div className="col-span-6 md:col-span-2 flex flex-col justify-between border rounded-md p-4">
          <div>
            <label htmlFor="rule-name" className="block text-sm font-medium text-gray-900">Display</label>
            <div className="mt-2">
              <textarea name="display" rows={display ? display.split("\n").length + 2 : 10} className="block w-full rounded-md bg-white p-4 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-600 text-xs border font-mono overflow-x-auto whitespace-pre" value={display} readOnly />
            </div>
          </div>
          <div className={`mt-4 flex justify-end gap-x-2 ${formMode === FormModeEnum.VIEW ? "hidden" : ""}`}>
            <button
              className="btn btn-sm btn-primary px-8"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div >
  )
}
