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

export default function AddExerciseDialog({
  isOpen,
  onClose,
  onSubmit,
  isAdding,
}: AddExerciseDialogProps) {
  const [exercise, setExercise] = useState({
    name: "",
    reps: "",
    sets: "",
    weight: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExercise((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: exercise.name,
      reps: parseInt(exercise.reps) || 0,
      sets: parseInt(exercise.sets) || 0,
      weight: parseFloat(exercise.weight) || 0,
    });
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
            name="reps"
            type="number"
            placeholder="Number of reps"
            value={exercise.reps}
            onChange={handleChange}
            required
          />
          <Input
            name="sets"
            type="number"
            placeholder="Number of sets"
            value={exercise.sets}
            onChange={handleChange}
            required
          />
          <Input
            name="weight"
            type="number"
            placeholder="Weight (kg)"
            value={exercise.weight}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            disabled={isAdding}
            variant="secondary"
            size="lg"
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
