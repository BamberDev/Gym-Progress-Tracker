// components/EditButton.tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useState } from "react";

export default function EditExerciseButton({
  exercise,
  onUpdate,
}: EditExerciseButtonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedExercise, setEditedExercise] = useState(exercise);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedExercise((prev) => ({
      ...prev,
      [name]: name === "name" ? value : parseFloat(value),
    }));
  };

  const handleUpdate = () => {
    onUpdate(editedExercise);
    setIsEditing(false);
  };

  return (
    <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-5 w-5 text-black" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#1f1f23] border-[#26252a] text-white">
        <DialogHeader>
          <DialogTitle>Edit Exercise</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-black">
          <Input
            name="name"
            value={editedExercise.name}
            onChange={handleChange}
            placeholder="Exercise name"
          />
          <Input
            name="reps"
            type="number"
            value={editedExercise.reps}
            onChange={handleChange}
            placeholder="Number of reps"
          />
          <Input
            name="sets"
            type="number"
            value={editedExercise.sets}
            onChange={handleChange}
            placeholder="Number of sets"
          />
          <Input
            name="weight"
            type="number"
            value={editedExercise.weight}
            onChange={handleChange}
            placeholder="Weight (kg)"
          />
          <div className="flex justify-end gap-2">
            <Button variant="destructive" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} variant="secondary">
              Update
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
