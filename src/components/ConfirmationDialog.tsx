import { Modal } from "./modal";
import { Button } from "./ui/button";

interface ConfirmationDialogProps {
  open: boolean;
  onClose?: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  onConfirmText?: string;
  onCancelText?: string;
  header?: string;
  contentText?: string;
}

export function ConfirmationDialog({
  open,
  onCancel,
  onClose = onCancel,
  onConfirm,
  onConfirmText = "Excluir",
  onCancelText = "Cancelar",
  header = "Confirmar Exclusão",
  contentText = "Tem certeza de que deseja excluir esta foto?",
}: ConfirmationDialogProps) {
  return (
    <Modal isOpen={open} onClose={onClose} header={header} isDialog>
      <p className="font-medium text-base">{contentText}</p>
      <div className="flex gap-4 justify-end mt-4 ">
        <Button onClick={onCancel} variant={"ghost"} size={"sm"}>
          {onCancelText}
        </Button>
        <Button onClick={onConfirm} variant="destructive" size={"sm"}>
          {onConfirmText}
        </Button>
      </div>
    </Modal>
  );
}
