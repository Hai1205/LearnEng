import { BookOpen } from "lucide-react";
import { AdminDialog } from "../layout/dialog/AdminDialog";
import { FixProblemForm } from "./FixProblemForm";

interface ViewFixProblemDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  data: IFixProblem | null;
}

export const ViewFixProblemDialog = ({
  isOpen,
  onClose,
  data,
}: ViewFixProblemDialogProps) => {
  return (
    <AdminDialog<IFixProblem>
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose?.();
        }
      }}
      title="View FixProblem"
      description="FixProblem information"
      icon={BookOpen}
      className="max-w-lg"
      showCloseButton={true}
    >
      <FixProblemForm data={data as IFixProblem | null} />
    </AdminDialog>
  );
};
