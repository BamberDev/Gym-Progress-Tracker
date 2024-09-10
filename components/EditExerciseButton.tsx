import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, Plus, Pencil, Check } from "lucide-react";

export default function EditExerciseButton({
  exercise,
  onUpdate,
  isOpen,
  onClose,
}: EditExerciseButtonProps) {
  const [editedExercise, setEditedExercise] = useState<Exercise>(exercise);
  const [currentSet, setCurrentSet] = useState<ExerciseSet>({
    reps: 0,
    weight: 0,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedExercise((prev) => ({
      ...prev,
      [name]: name === "restTime" ? parseFloat(value) : value,
    }));
  };

  const handleSetChange = (
    index: number,
    field: keyof ExerciseSet,
    value: number
  ) => {
    setEditedExercise((prev) => ({
      ...prev,
      sets: prev.sets.map((set, i) =>
        i === index ? { ...set, [field]: value } : set
      ),
    }));
  };

  const handleNewSetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentSet((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const addSet = () => {
    if (
      editedExercise.sets.length < 10 &&
      currentSet.reps &&
      currentSet.weight
    ) {
      setEditedExercise((prev) => ({
        ...prev,
        sets: [...prev.sets, currentSet],
      }));
      setCurrentSet({ reps: 0, weight: 0 });
    }
  };

  const removeSet = (index: number) => {
    setEditedExercise((prev) => ({
      ...prev,
      sets: prev.sets.filter((_, i) => i !== index),
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

  const toggleSetEdit = (index: number) => {
    setEditingIndex(editingIndex === index ? null : index);
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
          <div className="space-y-2">
            {editedExercise.sets.map((set, index) => (
              <div
                key={index}
                className="flex items-center justify-between space-x-2"
              >
                {editingIndex === index ? (
                  <>
                    <Input
                      type="number"
                      value={set.reps}
                      onChange={(e) =>
                        handleSetChange(index, "reps", parseInt(e.target.value))
                      }
                      placeholder="Reps"
                    />
                    <Input
                      type="number"
                      value={set.weight}
                      onChange={(e) =>
                        handleSetChange(
                          index,
                          "weight",
                          parseFloat(e.target.value)
                        )
                      }
                      placeholder="Weight (kg)"
                    />
                  </>
                ) : (
                  <>
                    <p className="text-white">
                      Set {index + 1}: {set.reps} reps x {set.weight} kg
                    </p>
                  </>
                )}
                <div className="flex space-x-2">
                  {editingIndex === index ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={() => toggleSetEdit(index)}
                    >
                      <Check className="h-5 w-5 text-black" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      onClick={() => toggleSetEdit(index)}
                    >
                      <Pencil className="h-5 w-5 text-black" />
                    </Button>
                  )}
                  {editingIndex !== index && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeSet(index)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {editedExercise.sets.length < 10 && (
            <div className="flex space-x-2">
              <Input
                name="reps"
                type="number"
                placeholder="Reps"
                value={currentSet.reps || ""}
                onChange={handleNewSetChange}
              />
              <Input
                name="weight"
                type="number"
                placeholder="Weight (kg)"
                value={currentSet.weight || ""}
                onChange={handleNewSetChange}
              />
              <Button
                type="button"
                onClick={addSet}
                disabled={!currentSet.reps || !currentSet.weight}
                variant="secondary"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          )}
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
