import { FormModeEnum } from "@/app/dashboard/rule/page";
import { RuleRowData } from "@/types/datatable";
import { Button, Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { useEffect, useState } from "react";



interface RuleFormProps {
  isFormOpen: boolean;
  formMode: FormModeEnum;
  rule: RuleRowData;
  closeForm: () => void;
}

export default function RuleForm({ isFormOpen, formMode, rule, closeForm }: RuleFormProps) {
  const [formData, setFormData] = useState<RuleRowData>(rule);

  if (rule !== formData) {
    setFormData(rule);
  }
  console.log(isFormOpen, formMode, rule.rule_name);

  const handleChanges = () => {

  }

  return (
    <Dialog open={isFormOpen} as="div" className="relative z-10 focus:outline-none" onClose={closeForm}>
      <DialogBackdrop className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-screen-2xl rounded-xl bg-white p-6 backdrop-blur-sm duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
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
              <div className="sm:col-span-6">
                <label htmlFor="rule-name" className="block text-sm/6 font-medium text-gray-900">Rule name</label>
                <div className="mt-2">
                  <input type="text" name="rule-name" className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border" value={formData.rule_name} onChange={handleChanges} />
                </div>
              </div>
              <div className="sm:col-span-6">
                <label htmlFor="rule-name" className="block text-sm/6 font-medium text-gray-900">Description</label>
                <div className="mt-2">
                  <input type="text" name="rule-name" className="block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 border" value={formData.description} onChange={handleChanges} />
                </div>
              </div>
              <div className="sm:col-span-6">
                <label htmlFor="rule-name" className="block text-sm/6 font-medium text-gray-900">Display</label>
                <div className="mt-2">
                  <textarea name="display" rows={formData.display ? formData.display.split("\n").length + 2 : 10} className="block w-full rounded-md bg-white px-4 py-4 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-600 text-xs border font-mono overflow-x-auto whitespace-pre" value={formData.display} readOnly />
                </div>
              </div>
            </div>
            <div className={`mt-4 flex justify-end ${formMode === FormModeEnum.VIEW ? "hidden" : ""}`}>
              <Button
                className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                onClick={closeForm}
              >
                Submit
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
