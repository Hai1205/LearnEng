import { Brain } from "lucide-react";
import { AdminDialog } from "../layout/dialog/AdminDialog";
import { TestResultForm } from "./TestResultForm";

interface CreateTestResultDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (
    field: keyof ITestResult,
    value: ITestResult[keyof ITestResult],
  ) => void;
  data: ITestResult | null;
  onTestResultCreated: () => void;
}

export const CreateTestResultDialog = ({
  isOpen,
  onOpenChange,
  onChange,
  data,
  onTestResultCreated,
}: CreateTestResultDialogProps) => {
  return (
    <AdminDialog<ITestResult>
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Create Test Result"
      description="Create test result information"
      icon={Brain}
      onSubmit={onTestResultCreated}
      isCreateDialog={true}
      className="max-w-lg"
    >
      <TestResultForm
        data={data as ITestResult | null}
        onChange={(field, value) => onChange(field as keyof ITestResult, value)}
      />
    </AdminDialog>
  );
};
