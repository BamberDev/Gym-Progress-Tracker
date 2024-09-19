import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Check, Plus } from "lucide-react";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

export default function ExerciseSetsManager({
  sets,
  onSetsChange,
  isEditable = true,
}: ExerciseSetsManagerProps) {
  const [currentSet, setCurrentSet] = useState<ExerciseSet>({
    reps: 0,
    weight: 0,
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleSetChange = (
    index: number,
    field: keyof ExerciseSet,
    value: number
  ) => {
    const updatedSets = sets.map((set, i) =>
      i === index ? { ...set, [field]: value } : set
    );
    onSetsChange(updatedSets);
  };

  const handleNewSetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentSet((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const addSet = () => {
    if (sets.length < 10 && currentSet.reps && currentSet.weight) {
      onSetsChange([...sets, currentSet]);
      setCurrentSet({ reps: 0, weight: 0 });
    }
  };

  const removeSet = (index: number) => {
    const updatedSets = sets.filter((_, i) => i !== index);
    onSetsChange(updatedSets);
  };

  const toggleSetEdit = (index: number) => {
    setEditingIndex(editingIndex === index ? null : index);
  };

  return (
    <div className="space-y-2">
      {sets.map((set, index) => (
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
                  handleSetChange(index, "weight", parseFloat(e.target.value))
                }
                placeholder="Weight (kg)"
              />
            </>
          ) : (
            <p className="text-white text-sm xs:text-base sm:text-lg">
              Set {index + 1}: {set.reps} reps x {set.weight} kg
            </p>
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
              isEditable && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={() => toggleSetEdit(index)}
                  >
                    <Pencil className="h-5 w-5 text-black" />
                  </Button>
                  <DeleteConfirmationDialog
                    onDelete={() => removeSet(index)}
                    entityName="set"
                  />
                </>
              )
            )}
          </div>
        </div>
      ))}
      {sets.length < 6 && isEditable && (
        <div className="flex space-x-2 pt-2">
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
            placeholder="Weight"
            value={currentSet.weight || ""}
            onChange={handleNewSetChange}
          />
          <Button
            type="button"
            onClick={addSet}
            disabled={!currentSet.reps || !currentSet.weight}
            variant="secondary"
          >
            <Plus className="mr-1 h-5 w-5 hidden xs:block" />
            Add Set
          </Button>
        </div>
      )}
    </div>
  );
}
