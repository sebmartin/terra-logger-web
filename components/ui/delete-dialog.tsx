import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "./alert-dialog";

interface DeleteDialogProps {
  title: string;
  description: string;
  open: boolean;
  onCancel: () => void;
  onDelete: () => void;
}

export function DeleteDialog({ title, description, open, onCancel, onDelete }: DeleteDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            open = false;
            onCancel()
          }}>
            No
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              open = false;
              onDelete()
            }}
            variant="destructive">
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}