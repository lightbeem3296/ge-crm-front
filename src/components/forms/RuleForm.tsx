import { FormModeEnum } from "@/app/dashboard/rule/page";
import { getRoleMappings } from "@/services/roleService";
import { ruleConditionCombinationOperatorCodes, ruleConditionCombinationOperatorMap, ruleActionMap, ruleActionMapCodes, ruleActionOperatorCodes, ruleActionOperatorMap, RuleConditionField, ruleConditionFieldCodes, ruleConditionFieldMap, ruleConditionOperatorCodes, ruleConditionOperatorMap, RuleRowData } from "@/types/datatable";
import { extractKeys, lookupValue } from "@/utils/record";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { useState } from "react";
import { DeleteButton } from "../ui/datatable/button";



interface RuleFormProps {
  isFormOpen: boolean;
  formMode: FormModeEnum;
  rule: RuleRowData;
  closeForm: () => void;
}

const roleMappings = await getRoleMappings();
const roleCodes = extractKeys(roleMappings);

export default function RuleForm({ isFormOpen, formMode, rule, closeForm }: RuleFormProps) {
  const [formData, setFormData] = useState<RuleRowData>(rule);

  if (rule !== formData) {
    setFormData(rule);
  }
  console.log(isFormOpen, formMode, rule.rule_name, JSON.stringify(rule.atomic_rules));

  const handleChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event?.target;
    console.log(name, value);
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event?.target;
    console.log(name, value);
  }

  const handleSave = () => {
    closeForm();
  }

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
                    value={formData.rule_name}
                    onChange={handleChanges}
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
                    value={formData.description}
                    onChange={handleChanges}
                    readOnly={formMode === FormModeEnum.VIEW} />
                </div>
              </div>

              {/* Edit Rule */}
              <div className="join join-vertical col-span-6 rounded-md">
                {formMode !== FormModeEnum.VIEW
                  ? rule.atomic_rules.map((atomic_rule, rule_index) => (
                    <div
                      key={rule_index}
                      className="collapse collapse-plus join-item border border-base-300"
                    >
                      <input type="checkbox" className="peer" defaultChecked={rule_index === 0} />
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
                                  value={atomic_rule.condition.combination}
                                  onChange={handleSelectChange}
                                >
                                  <option disabled value="">Select an operator</option>
                                  {ruleConditionCombinationOperatorCodes.map((key) => (
                                    <option key={key} value={key}>
                                      {lookupValue(ruleConditionCombinationOperatorMap, key)}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              {/* New Atomic Condition Button */}
                              <div className="col-span-6 sm:col-span-2 flex justify-center place-items-end">
                                <button className="btn btn-sm btn-primary w-full">Add Atom Condition</button>
                              </div>
                            </div>

                            {/* Atomic Conditions */}
                            {atomic_rule.condition.conditions.map((atomic_condition, condition_index) => (
                              <div key={condition_index} className="grid grid-cols-7 gap-2 sm:col-span-6 border rounded-md p-2">
                                <div className="text-sm font-medium p-2 border-b col-span-7">Atom Contition {condition_index + 1}</div>

                                {/* Condition Field */}
                                <label className="form-control w-full col-span-7 sm:col-span-2">
                                  <div className="label">
                                    <span className="label-text">Field</span>
                                  </div>
                                  <select
                                    className="select select-bordered select-sm"
                                    value={atomic_condition.field}
                                    onChange={handleSelectChange}
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
                                <label className="form-control w-full col-span-7 sm:col-span-2">
                                  <div className="label">
                                    <span className="label-text">Operator</span>
                                  </div>
                                  <select
                                    className="select select-bordered select-sm"
                                    value={atomic_condition.operator}
                                    onChange={handleSelectChange}
                                  >
                                    <option disabled value="">Select an operator</option>
                                    {ruleConditionOperatorCodes.map((key) => (
                                      <option key={key} value={key}>
                                        {lookupValue(ruleConditionOperatorMap, key)}
                                      </option>
                                    ))}
                                  </select>
                                </label>

                                {/* Condition Value */}
                                <label className="form-control w-full col-span-7 sm:col-span-2">
                                  <div className="label">
                                    <span className="label-text">Value</span>
                                  </div>
                                  {atomic_condition.field === RuleConditionField.ROLE
                                    ? <select
                                      className="select select-bordered select-sm"
                                      value={atomic_condition.value}
                                      onChange={handleSelectChange}
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
                                      value={atomic_condition.value}
                                      onChange={handleChanges}
                                    />}
                                </label>
                                <div className="col-span-7 sm:col-span-1 flex justify-center place-items-end">
                                  <button className="btn btn-sm btn-error w-full">Delete</button>
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
                                value={atomic_rule.action.operator}
                                onChange={handleSelectChange}
                              >
                                <option disabled value="">Select a field</option>
                                {ruleActionMapCodes.map((key) => (
                                  <option key={key} value={key}>
                                    {lookupValue(ruleActionMap, key)}
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
                                value={atomic_rule.action.operator}
                                onChange={handleSelectChange}
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
                                value={atomic_rule.action.value}
                                onChange={handleChanges}
                              />
                            </label>
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
                  <textarea name="display" rows={formData.display ? formData.display.split("\n").length + 2 : 10} className="block w-full rounded-md bg-white p-4 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-600 text-xs border font-mono overflow-x-auto whitespace-pre" value={formData.display} readOnly />
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
