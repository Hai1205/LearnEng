import { Brain } from "lucide-react";
import { AdminDialog } from "../layout/dialog/AdminDialog";
import { TestResultForm } from "./TestResultForm";

interface UpdateTestResultDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (
    field: keyof ITestResult,
    value: ITestResult[keyof ITestResult],
  ) => void;
  data: ITestResult | null;
  onTestResultUpdated: () => void;
}

export const UpdateTestResultDialog = ({
  isOpen,
  onOpenChange,
  onChange,
  data,
  onTestResultUpdated,
}: UpdateTestResultDialogProps) => {
  return (
    <AdminDialog<ITestResult>
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Edit Test Result"
      description="Update test result information"
      icon={Brain}
      onSubmit={onTestResultUpdated}
      isCreateDialog={false}
      className="max-w-lg"
    >
      <TestResultForm
        data={data as ITestResult | null}
        onChange={(field, value) => onChange(field as keyof ITestResult, value)}
      />
    </AdminDialog>
  );
};
