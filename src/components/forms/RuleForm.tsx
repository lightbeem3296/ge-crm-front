import { FormModeEnum } from "@/app/dashboard/rule/page";
import { RuleRowData } from "@/types/datatable";
import { Button, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react"
import { useEffect, useState } from "react";



interface RuleFormProps {
  isFormOpen: boolean;
  formMode: FormModeEnum;
  rule: RuleRowData;
  closeForm: () => void;
}

export default function RuleForm({ isFormOpen, formMode, rule, closeForm }: RuleFormProps) {
  console.log(isFormOpen, formMode, rule.rule_name);

  return (
    <Dialog open={isFormOpen} as="div" className="relative z-10 focus:outline-none" onClose={closeForm}>
      <DialogBackdrop className="fixed inset-0 bg-black/30" transition />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle as="h3" className="text-base/7 font-medium">
              {
                formMode === FormModeEnum.CREATE
                  ? "Create New Rule"
                  : formMode === FormModeEnum.EDIT
                    ? "Edit Rule"
                    : "View Rule"
              }
            </DialogTitle>
            <p className="mt-2 text-sm/6">
              Your payment has been successfully submitted. We’ve sent you an email with all of the details of your
              order.
            </p>
            <div className="mt-4">
              <Button
                className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-gray-700"
                onClick={closeForm}
              >
                Got it, thanks!
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
