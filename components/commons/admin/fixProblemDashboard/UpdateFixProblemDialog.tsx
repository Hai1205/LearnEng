import { BookOpen } from "lucide-react";
import { AdminDialog } from "../layout/dialog/AdminDialog";
import { FixProblemForm } from "./FixProblemForm";

interface UpdateFixProblemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (field: keyof IFixProblem, value: IFixProblem[keyof IFixProblem]) => void;
  data: IFixProblem | null;
  onFixProblemUpdated: () => void;
}

export const UpdateFixProblemDialog = ({
  isOpen,
  onOpenChange,
  onChange,
  data,
  onFixProblemUpdated,
}: UpdateFixProblemDialogProps) => {
  return (
    <AdminDialog<IFixProblem>
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Edit FixProblem"
      description="Update Fix Problem information"
      icon={BookOpen}
      onSubmit={onFixProblemUpdated}
      isCreateDialog={false}
      className="max-w-lg"
    >
      <FixProblemForm
        data={data as IFixProblem | null}
        onChange={(field, value) => onChange(field as keyof IFixProblem, value)}
      />
    </AdminDialog>
  );
};
