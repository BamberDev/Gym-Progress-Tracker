import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ExerciseSetsManager from "./ExerciseSetsManager";
import { clientExerciseSchema, validateForm } from "@/utils/zodSchema";
import ErrorAlert from "./ErrorAlert";
import { useErrorTimeout } from "@/hooks/useErrorTimeout";

export default function EditExerciseDialog({
  exercise,
  onUpdate,
  isOpen,
  onClose,
}: EditExerciseButtonProps) {
  const [editedExercise, setEditedExercise] = useState<Exercise>(exercise);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { clearErrorTimer, clearExistingTimer } = useErrorTimeout(() =>
    setFetchError(null)
  );

  useEffect(() => {
    setEditedExercise(exercise);
    setErrors({});
  }, [exercise]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedExercise((prev) => ({
      ...prev,
      [name]: name === "restTime" ? (value ? parseFloat(value) : null) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateFormForEditExercise = () => {
    const { valid, errors: validationErrors } = validateForm(
      clientExerciseSchema,
      editedExercise
    );
    setErrors(validationErrors);
    return valid;
  };

  const handleUpdate = async () => {
    if (!validateFormForEditExercise()) {
      return;
    }
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/exercises/${editedExercise._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedExercise),
      });
      if (!response.ok) {
        throw new Error("Failed to update exercise. Please try again later.");
      }
      const updatedExercise = await response.json();
      onUpdate(updatedExercise);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setFetchError(error.message);
      } else {
        setFetchError("An unexpected error occurred.");
      }
      clearExistingTimer();
      clearErrorTimer();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose();
        clearErrorTimer();
        setFetchError(null);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Exercise</DialogTitle>
          <DialogDescription className="hidden">
            Edit exercise dialog
          </DialogDescription>
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
            placeholder="Rest between sets (min)"
            value={editedExercise.restTime ?? ""}
            onChange={handleChange}
          />
          <ExerciseSetsManager
            sets={editedExercise.sets}
            onSetsChange={(newSets) => {
              setEditedExercise((prev) => ({ ...prev, sets: newSets }));
              if (errors.sets) {
                setErrors((prev) => ({ ...prev, sets: "" }));
              }
            }}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              variant="secondary"
              className="w-full"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-1 h-5 w-5 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
          {(errors.name || errors.restTime || errors.sets || fetchError) && (
            <ErrorAlert
              alertDescription={
                errors.name || errors.restTime || errors.sets || fetchError
              }
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
