import { UserCog } from "lucide-react";
import { AdminDialog } from "../layout/dialog/AdminDialog";
import { FlashCardForm } from "./FlashCardForm";

interface UpdateFlashCardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (field: keyof IFlashCard, value: IFlashCard[keyof IFlashCard]) => void;
  data: IFlashCard | null;
  onFlashCardUpdated: () => void;
}

export const UpdateFlashCardDialog = ({
  isOpen,
  onOpenChange,
  onChange,
  data,
  onFlashCardUpdated,
}: UpdateFlashCardDialogProps) => {
  return (
    <AdminDialog<IFlashCard>
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Edit Flash Card"
      description="Update flash card information"
      icon={UserCog}
      onSubmit={onFlashCardUpdated}
      isCreateDialog={false}
      className="max-w-lg"
    >
      <FlashCardForm
        data={data as IFlashCard | null}
        onChange={(field, value) => onChange(field as keyof IFlashCard, value)}
      />
    </AdminDialog>
  );
};
