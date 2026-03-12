import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { VariantProps } from "class-variance-authority";

export interface DeleteButtonProps extends VariantProps<typeof buttonVariants> {
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
}

export function DeleteButton({
  title = "Confirm deletion",
  description,
  onConfirm,
  onCancel,
  children,
}: DeleteButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel ?? (() => {})}>No</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} variant="destructive">
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
