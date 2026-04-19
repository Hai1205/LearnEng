import { BookOpen } from "lucide-react";
import { AdminDialog } from "../layout/dialog/AdminDialog";
import { FixProblemForm } from "./FixProblemForm";

interface CreateFixProblemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (field: keyof IFixProblem, value: IFixProblem[keyof IFixProblem]) => void;
  data: IFixProblem | null;
  onFixProblemCreated: () => void;
}

export const CreateFixProblemDialog = ({
  isOpen,
  onOpenChange,
  onChange,
  data,
  onFixProblemCreated,
}: CreateFixProblemDialogProps) => {
  return (
    <AdminDialog<IFixProblem>
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Create FixProblem"
      description="Create FixProblem information"
      icon={BookOpen}
      onSubmit={onFixProblemCreated}
      isCreateDialog={true}
      className="max-w-lg"
    >
      <FixProblemForm
        data={data as IFixProblem | null}
        onChange={(field, value) => onChange(field as keyof IFixProblem, value)}
      />
    </AdminDialog>
  );
};
