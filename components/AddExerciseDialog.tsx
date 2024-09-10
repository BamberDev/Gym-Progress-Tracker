import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

export default function AddExerciseDialog({
  isOpen,
  onClose,
  onSubmit,
}: AddExerciseDialogProps) {
  const [exercise, setExercise] = useState<NewExercise>({
    name: "",
    restTime: "",
    sets: [],
  });
  const [currentSet, setCurrentSet] = useState<ExerciseSet>({
    reps: 0,
    weight: 0,
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExercise((prev) => ({
      ...prev,
      [name]: name === "restTime" ? parseFloat(value) : value,
    }));
  };

  const handleSetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentSet((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const addSet = () => {
    if (exercise.sets.length < 10 && currentSet.reps && currentSet.weight) {
      setExercise((prev) => ({
        ...prev,
        sets: [...prev.sets, currentSet],
      }));
      setCurrentSet({ reps: 0, weight: 0 });
    }
  };

  const removeSet = (index: number) => {
    setExercise((prev) => ({
      ...prev,
      sets: prev.sets.filter((_, i) => i !== index),
    }));
  };

  const addExercise = async (exercise: NewExercise) => {
    try {
      setIsAdding(true);
      const response = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exercise),
      });
      if (!response.ok) {
        throw new Error("Failed to add exercise");
      }
      const newExercise = await response.json();
      onSubmit(newExercise);
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
          <div className="space-y-2">
            {exercise.sets.map((set, index) => (
              <div key={index} className="flex items-center justify-between">
                <p className="text-white">
                  Set {index + 1} - {set.reps} reps x {set.weight} kg
                </p>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeSet(index)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
          {exercise.sets.length < 10 && (
            <div className="flex space-x-2">
              <Input
                name="reps"
                type="number"
                placeholder="Reps"
                value={currentSet.reps || ""}
                onChange={handleSetChange}
              />
              <Input
                name="weight"
                type="number"
                placeholder="Weight (kg)"
                value={currentSet.weight || ""}
                onChange={handleSetChange}
              />
              <Button
                type="button"
                onClick={addSet}
                disabled={!currentSet.reps || !currentSet.weight}
                variant="secondary"
              >
                Add Set
              </Button>
            </div>
          )}
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
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
