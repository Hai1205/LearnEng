import { Brain } from "lucide-react";
import { AdminDialog } from "../layout/dialog/AdminDialog";
import { FlashCardForm } from "./FlashCardForm";

interface CreateFlashCardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onChange: (field: keyof IFlashCard, value: IFlashCard[keyof IFlashCard]) => void;
  data: IFlashCard | null;
  onFlashCardCreated: () => void;
}

export const CreateFlashCardDialog = ({
  isOpen,
  onOpenChange,
  onChange,
  data,
  onFlashCardCreated,
}: CreateFlashCardDialogProps) => {
  return (
    <AdminDialog<IFlashCard>
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Create Flash Card"
      description="Create flash card information"
      icon={Brain}
      onSubmit={onFlashCardCreated}
      isCreateDialog={true}
      className="max-w-lg"
    >
      <FlashCardForm
        data={data as IFlashCard | null}
        onChange={(field, value) => onChange(field as keyof IFlashCard, value)}
      />
    </AdminDialog>
  );
};
