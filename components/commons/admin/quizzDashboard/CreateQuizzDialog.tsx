import { BookOpen } from "lucide-react";
import { AdminDialog } from "../layout/dialog/AdminDialog";
import { QuizzForm } from "./QuizzForm";

interface CreateQuizzDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (field: keyof IQuizz, value: IQuizz[keyof IQuizz]) => void;
  data: IQuizz | null;
  onQuizzCreated: () => void;
}

export const CreateQuizzDialog = ({
  isOpen,
  onOpenChange,
  onChange,
  data,
  onQuizzCreated,
}: CreateQuizzDialogProps) => {
  return (
    <AdminDialog<IQuizz>
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Create Quizz"
      description="Create quizz information"
      icon={BookOpen}
      onSubmit={onQuizzCreated}
      isCreateDialog={true}
      className="max-w-lg"
    >
      <QuizzForm
        data={data as IQuizz | null}
        onChange={(field, value) => onChange(field as keyof IQuizz, value)}
      />
    </AdminDialog>
  );
};
