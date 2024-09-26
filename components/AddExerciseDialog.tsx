import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import ExerciseSetsManager from "./ExerciseSetsManager";
import { clientExerciseSchema, validateForm } from "@/utils/zodSchema";
import ErrorAlert from "./ErrorAlert";
import { useErrorTimeout } from "@/hooks/useErrorTimeout";

export default function AddExerciseDialog({
  isOpen,
  onClose,
  onSubmit,
  groupId,
}: AddExerciseDialogProps) {
  const initialExerciseState: NewExercise = {
    name: "",
    restTime: null,
    sets: [],
    groupId: groupId,
  };

  const [exercise, setExercise] = useState<NewExercise>(initialExerciseState);
  const [isAdding, setIsAdding] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { clearErrorTimer, clearExistingTimer } = useErrorTimeout(() =>
    setFetchError(null)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExercise((prev) => ({
      ...prev,
      [name]: name === "restTime" ? (value ? parseFloat(value) : null) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateFormForAddExercise = () => {
    const { valid, errors: validationErrors } = validateForm(
      clientExerciseSchema,
      exercise
    );
    setErrors(validationErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFormForAddExercise()) {
      return;
    }
    try {
      setIsAdding(true);
      const response = await fetch("/api/exercises", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exercise),
      });
      if (!response.ok) {
        throw new Error("Failed to add exercise. Please try again later.");
      }
      const newExercise = await response.json();
      onSubmit(newExercise);
      setExercise(initialExerciseState);
    } catch (error) {
      if (error instanceof Error) {
        setFetchError(error.message);
      } else {
        setFetchError("An unexpected error occurred.");
      }
      clearExistingTimer();
      clearErrorTimer();
    } finally {
      setIsAdding(false);
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
          <DialogTitle>Add New Exercise</DialogTitle>
          <DialogDescription className="hidden">
            Add exercise dialog
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <Input
            name="name"
            placeholder="Exercise name"
            value={exercise.name}
            onChange={handleChange}
            required
          />
          <Input
            name="restTime"
            type="number"
            placeholder="Rest between sets (min)"
            value={exercise.restTime ?? ""}
            onChange={handleChange}
            required
          />
          <ExerciseSetsManager
            sets={exercise.sets}
            onSetsChange={(newSets) => {
              setExercise((prev) => ({ ...prev, sets: newSets }));
              if (errors.sets) {
                setErrors((prev) => ({ ...prev, sets: "" }));
              }
            }}
          />
          <Button
            type="submit"
            disabled={isAdding}
            variant="secondary"
            className="w-full"
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-1 h-5 w-5 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-1 h-5 w-5" />
                Add Exercise
              </>
            )}
          </Button>
          {(errors.name || errors.restTime || errors.sets || fetchError) && (
            <ErrorAlert
              alertDescription={
                errors.name || errors.restTime || errors.sets || fetchError
              }
            />
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
