import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ExerciseSetsManager from "./ExerciseSetsManager";

export default function EditExerciseDialog({
  exercise,
  onUpdate,
  isOpen,
  onClose,
}: EditExerciseButtonProps) {
  const [editedExercise, setEditedExercise] = useState<Exercise>(exercise);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedExercise((prev) => ({
      ...prev,
      [name]: name === "restTime" ? parseFloat(value) : value,
    }));
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/exercises/${editedExercise._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedExercise),
      });
      if (!response.ok) {
        throw new Error("Failed to update exercise");
      }
      const updatedExercise = await response.json();
      onUpdate(updatedExercise);
      onClose();
    } catch (error) {
      console.error("Error updating exercise:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1f1f23] border-[#26252a] text-white">
        <DialogHeader>
          <DialogTitle>Edit Exercise</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-black">
          <Input
            name="name"
            placeholder="Exercise name"
            value={editedExercise.name}
            onChange={handleChange}
            required
          />
          <Input
            name="restTime"
            type="number"
            placeholder="Rest time (min)"
            value={editedExercise.restTime}
            onChange={handleChange}
          />
          <ExerciseSetsManager
            sets={editedExercise.sets}
            onSetsChange={(newSets) =>
              setEditedExercise((prev) => ({ ...prev, sets: newSets }))
            }
          />
          <div className="flex justify-end gap-2">
            <Button variant="destructive" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating || editedExercise.name === ""}
              variant="secondary"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
