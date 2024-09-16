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

export default function AddExerciseDialog({
  isOpen,
  onClose,
  onSubmit,
  groupId,
}: AddExerciseDialogProps) {
  const initialExerciseState: NewExercise = {
    name: "",
    restTime: "",
    sets: [],
    groupId: groupId,
  };

  const [exercise, setExercise] = useState<NewExercise>(initialExerciseState);
  const [isAdding, setIsAdding] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExercise((prev) => ({
      ...prev,
      [name]: name === "restTime" ? parseFloat(value) : value,
    }));
  };

  const addExercise = async (exercise: NewExercise) => {
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
        throw new Error("Failed to add exercise");
      }
      const newExercise = await response.json();
      onSubmit(newExercise);
      setExercise(initialExerciseState);
    } catch (error) {
      console.error("Error adding exercise:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExercise(exercise);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1f1f23] border-[#26252a] text-white">
        <DialogHeader>
          <DialogTitle>Add New Exercise</DialogTitle>
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
            placeholder="Rest time (min)"
            value={exercise.restTime}
            onChange={handleChange}
          />
          <ExerciseSetsManager
            sets={exercise.sets}
            onSetsChange={(newSets) =>
              setExercise((prev) => ({ ...prev, sets: newSets }))
            }
          />
          <Button
            type="submit"
            disabled={
              isAdding || exercise.sets.length === 0 || exercise.name === ""
            }
            variant="secondary"
            size="lg"
            className="w-full"
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Exercise"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
