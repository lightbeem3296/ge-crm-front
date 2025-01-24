"use client";

import { RuleRowData } from "@/types/datatable";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { axiosHelper } from "@/lib/axios";
import { ApiGeneralResponse } from "@/types/api";
import { extractKeys, lookupValue } from "@/utils/record";
import { getRoleMappings } from "@/services/roleService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { RuleConditionCombinator, ruleConditionCombinatorCodes, ruleConditionCombinatorMap, RuleConditionField, ruleConditionFieldCodes, ruleConditionFieldMap, RuleConditionNumberOperator, ruleConditionNumberOperatorCodes, ruleConditionNumberOperatorMap, ruleConditionObjectOperatorCodes, ruleConditionObjectOperatorMap } from "@/types/rule/condition";
import { RuleActionField, ruleActionFieldCodes, ruleActionFieldMap, RuleActionOperator, ruleActionOperatorCodes, ruleActionOperatorMap } from "@/types/rule/action";
import { customAlert, CustomAlertType } from "@/components/ui/alert";
import { RuleEditPageMode } from "@/types/rule/edit";

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
        condition: {
          combinator: RuleConditionCombinator.NONE,
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
          condition: {
            combinator: RuleConditionCombinator.NONE,
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
              combinator: atom_rule.condition.combinator === RuleConditionCombinator.NONE || atom_rule.condition.combinator === RuleConditionCombinator.NOT
                ? RuleConditionCombinator.AND
                : atom_rule.condition.combinator,
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
  }, []);

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
  }, [currentRuleIndex, actionValues]);

  useEffect(() => {
    updateDisplay();
  }, [rule]);

  useEffect(() => {
    setActionValues(rule.atom_rules.map((atom_rule) => atom_rule.action.value.toString()));
  }, [rule.atom_rules.length]);

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
              className="btn btn-primary text-gray-100 btn-sm btn-outline"
              onClick={() => handleClickNewAtomRule()}
            >
              <FontAwesomeIcon icon={faPlus} width={12} />Add Atom Rule
            </button>
          </div>

          {/* Edit Rule */}
          <div className="join join-vertical rounded-md">
            {rule.atom_rules.map((atom_rule, rule_index) => (
              // Atom Rules
              <div key={rule_index} className="collapse collapse-arrow join-item border border-base-content/20">
                <input type="checkbox" className="peer" defaultChecked={rule_index === 0} />
                <div className="collapse-title font-medium">Atom Rule {rule_index + 1}</div>
                <div className="collapse-content">
                  <div className="w-full grid grid-cols-6 gap-2">

                    {/* Condition */}
                    <div className="col-span-6 sm:col-span-4 flex flex-col gap-2 border border-base-content/20 rounded-lg p-2">
                      <div className="text-sm font-medium p-2 border-b border-base-content/20">Condition</div>

                      <div className="w-full flex flex-col gap-2">

                        {/* Combinator */}
                        <label className="form-control">
                          <div className="label">
                            <span className="label-text">Combinator</span>
                          </div>
                          <select
                            className="select select-bordered select-sm"
                            value={atom_rule.condition.combinator}
                            onChange={(e) => handleChangeConditionCombinator(rule_index, e.target.value)}
                          >
                            <option disabled value="">Select an operator</option>
                            {ruleConditionCombinatorCodes.map((key) => (
                              <option key={key} value={key} disabled={atom_rule.condition.conditions.length > 1 && (key === RuleConditionCombinator.NONE || key === RuleConditionCombinator.NOT)}>
                                {lookupValue(ruleConditionCombinatorMap, key)}
                              </option>
                            ))}
                          </select>
                        </label>

                        {/* New Atom Condition Button */}
                        <div className="flex place-items-end mt-4">
                          <button
                            className="btn btn-sm btn-primary btn-outline text-gray-100"
                            onClick={() => handleClickNewAtomCondition(rule_index)}
                          >
                            <FontAwesomeIcon icon={faPlus} width={12} />Add Atom Condition
                          </button>
                        </div>
                      </div>

                      {/* Atom Conditions */}
                      <div className="join join-vertical w-full border border-base-content/20">
                        {atom_rule.condition.conditions.map((atom_condition, condition_index) => (
                          <div key={condition_index} className={`join-item collapse collapse-arrow ${condition_index !== 0 ? "border-t" : ""} border-base-content/20`}>
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
                    <div className="col-span-6 sm:col-span-2 flex flex-col gap-2 border border-base-content/20 rounded-lg p-2">
                      <div className="text-sm font-medium p-2 border-b border-base-content/20">Action</div>

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
                          value={actionValues.length > rule_index ? actionValues[rule_index] : "0.0"}
                          onChange={(e) => {
                            setCurrentRuleIndex(rule_index);
                            setActionValues(prev => {
                              const newActionValues = [...prev];
                              newActionValues[rule_index] = e.target.value;
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
                        onClick={(e) => handleClickDeleteAtomRule(rule_index)} // eslint-disable-line
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
      <RuleEditPageContent/>
    </Suspense>
  );
}
