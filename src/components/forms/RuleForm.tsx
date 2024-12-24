import { FormModeEnum } from "@/app/dashboard/rule/page";
import { axiosHelper } from "@/lib/axios";
import { getRoleMappings } from "@/services/roleService";
import { ApiCrudResponse } from "@/types/api";
import { ruleConditionCombinationOperatorCodes, ruleConditionCombinationOperatorMap, ruleActionFieldMap, ruleActionFieldCodes, ruleActionOperatorCodes, ruleActionOperatorMap, RuleConditionField, ruleConditionFieldCodes, ruleConditionFieldMap, ruleConditionNumberOperatorCodes, ruleConditionNumberOperatorMap, RuleRowData, RuleConditionNumberOperator, ruleConditionObjectOperatorCodes, ruleConditionObjectOperatorMap, RuleConditionCombinationOperator, RuleActionField, RuleActionOperator } from "@/types/datatable";
import { extractKeys, lookupValue } from "@/utils/record";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { useEffect, useState } from "react";

interface RuleFormProps {
  isFormOpen: boolean;
  formMode: FormModeEnum;
  rule: RuleRowData;
  setRule: React.Dispatch<React.SetStateAction<RuleRowData>>
  closeForm: () => void;
}

const roleMappings = await getRoleMappings();
const roleCodes = extractKeys(roleMappings);

export default function RuleForm({ isFormOpen, formMode, rule, setRule, closeForm }: RuleFormProps) {
  const [display, setDisplay] = useState<string>();

  // UI Handlers
  const handleChangeRuleName = (value: string) => {
    setRule({
      ...rule,
      rule_name: value,
    })
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
        closeForm();
      }
    } else if (formMode === FormModeEnum.EDIT) {
      const response = await axiosHelper.put<RuleRowData, ApiCrudResponse>(`/rule/${rule._id}`, rule, "Are you sure want to save?");
      if (response) {
        closeForm();
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
    <Dialog open={isFormOpen} as="div" className="relative z-10 focus:outline-none" onClose={closeForm}>
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-screen-xl rounded-xl bg-white p-6 backdrop-blur-sm duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
            <DialogTitle as="h3" className="text-base/7 font-medium border-b p-2">
              {
                formMode === FormModeEnum.CREATE
                  ? "Create New Rule"
                  : formMode === FormModeEnum.EDIT
                    ? "Edit Rule"
                    : "View Rule"
              }
            </DialogTitle>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-6 gap-x-4 gap-y-4 w-full">
              {/* Rulename */}
              <div className="col-span-6">
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
              <div className="col-span-6">
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

              <div className="col-span-6">
                <button
                  className="btn btn-primary btn-sm btn-outline"
                  onClick={() => handleClickNewAtomRule()}
                >
                  <FontAwesomeIcon icon={faPlus} width={12} />Add Atom Rule
                </button>
              </div>

              {/* Edit Rule */}
              <div className="join join-vertical col-span-6 rounded-md">
                {formMode !== FormModeEnum.VIEW
                  ? rule.atom_rules.map((atom_rule, rule_index) => (
                    // Atom Rules
                    <div
                      key={rule_index}
                      className="collapse collapse-plus join-item border border-base-300"
                    >
                      <input type="checkbox" className="peer" />
                      <div className="collapse-title h-8 text-sm font-medium">Atom Rule {rule_index + 1}</div>
                      <div className="collapse-content">
                        <div className="w-full grid grid-cols-6 gap-2">

                          {/* Condition */}
                          <div className="col-span-6 sm:col-span-4 flex flex-col gap-2 border rounded-lg p-2">
                            <div className="text-sm font-medium p-2 border-b">Condition</div>

                            <div className="w-full grid grid-cols-6 gap-2">
                              {/* Combination */}
                              <label className="form-control col-span-6 sm:col-span-4">
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
                              <div className="col-span-6 sm:col-span-2 flex justify-center place-items-end">
                                <button
                                  className="btn btn-sm btn-primary btn-outline w-full"
                                  onClick={() => handleClickNewAtomCondition(rule_index)}
                                >
                                  <FontAwesomeIcon icon={faPlus} width={12} />Add Atom Condition
                                </button>
                              </div>
                            </div>

                            {/* Atom Conditions */}
                            {atom_rule.condition.conditions.map((atom_condition, condition_index) => (
                              <div key={condition_index} className="grid grid-cols-8 gap-2 sm:col-span-6 border rounded-md p-2">
                                <div className="text-sm font-medium p-2 border-b col-span-8">Atom Contition {condition_index + 1}</div>

                                {/* Condition Field */}
                                <label className="form-control w-full col-span-8 sm:col-span-2">
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
                                <label className="form-control w-full col-span-8 sm:col-span-2">
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
                                <label className="form-control w-full col-span-8 sm:col-span-2">
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
                                <div className="col-span-8 sm:col-span-2 flex justify-center place-items-end">
                                  <button
                                    className="btn btn-sm btn-error btn-outline w-full"
                                    onClick={() => { handleClickDeleteAtomCondition(rule_index, condition_index) }}
                                  >
                                    <FontAwesomeIcon icon={faTrash} width={12} />Delete
                                  </button>
                                </div>
                              </div>
                            ))}
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

              {/* Display */}
              <div className="col-span-6">
                <label htmlFor="rule-name" className="block text-sm font-medium text-gray-900">Display</label>
                <div className="mt-2">
                  <textarea name="display" rows={display ? display.split("\n").length + 2 : 10} className="block w-full rounded-md bg-white p-4 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-600 text-xs border font-mono overflow-x-auto whitespace-pre" value={display} readOnly />
                </div>
              </div>
            </div>
            <div className={`mt-4 flex justify-end gap-x-2 ${formMode === FormModeEnum.VIEW ? "hidden" : ""}`}>
              <button
                className="btn btn-sm btn-primary px-8"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="btn btn-sm px-8"
                onClick={closeForm}
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div >
      </div >
    </Dialog >
  )
}
