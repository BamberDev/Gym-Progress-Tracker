import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function DeleteExerciseDialog({
  exerciseId,
  onDelete,
}: DeleteExerciseButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    onDelete(exerciseId);
    setIsDeleting(false);
  };

  return (
    <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1f1f23] border-[#26252a] text-white">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            This action cannot be undone. This will permanently delete the
            exercise.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsDeleting(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
