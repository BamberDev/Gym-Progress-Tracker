import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteConfirmationDialog({
  onDelete,
  entityName,
}: DeleteConfirmationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="destructive" size="icon">
          <Trash2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription className="sr-only">
            Delete confirmation dialog
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-center">
            This action cannot be undone. This will permanently delete this{" "}
            {entityName}.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
              className="w-full"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-1 h-5 w-5 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
