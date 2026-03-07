import { UserCog } from "lucide-react";
import { AdminDialog } from "../layout/dialog/AdminDialog";
import { QuizzForm } from "./QuizzForm";

interface UpdateQuizzDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (field: keyof IQuizz, value: IQuizz[keyof IQuizz]) => void;
  data: IQuizz | null;
  onQuizzUpdated: () => void;
}

export const UpdateQuizzDialog = ({
  isOpen,
  onOpenChange,
  onChange,
  data,
  onQuizzUpdated,
}: UpdateQuizzDialogProps) => {
  return (
    <AdminDialog<IQuizz>
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Edit Quizz"
      description="Update quizz information"
      icon={UserCog}
      onSubmit={onQuizzUpdated}
      isCreateDialog={false}
      className="max-w-lg"
    >
      <QuizzForm
        data={data as IQuizz | null}
        onChange={(field, value) => onChange(field as keyof IQuizz, value)}
      />
    </AdminDialog>
  );
};
