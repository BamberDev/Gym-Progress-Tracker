import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Check, Plus } from "lucide-react";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { exerciseSetSchema } from "@/utils/zodSchema/exerciseSchema";
import { Alert, AlertDescription } from "./ui/alert";

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
  const [errors, setErrors] = useState<string>("");

  const validateSet = (set: ExerciseSet) => {
    const result = exerciseSetSchema.safeParse(set);
    if (!result.success) {
      setErrors(result.error.errors.map((err) => err.message).join("\n"));
      return false;
    }
    setErrors("");
    return true;
  };

  const handleSetChange = (
    index: number,
    field: keyof ExerciseSet,
    value: string
  ) => {
    setErrors("");
    const parsedValue = value === "" ? 0 : Number(value);
    const updatedSet = { ...sets[index], [field]: parsedValue };
    const updatedSets = sets.map((set, i) => (i === index ? updatedSet : set));
    onSetsChange(updatedSets);
  };

  const handleNewSetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors("");
    const { name, value } = e.target;
    const parsedValue = value === "" ? 0 : parseInt(value);
    setCurrentSet((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const addSet = () => {
    if (sets.length < 6 && validateSet(currentSet)) {
      onSetsChange([...sets, currentSet]);
      setCurrentSet({ reps: 0, weight: 0 });
      setErrors("");
    }
  };

  const removeSet = (index: number) => {
    const updatedSets = sets.filter((_, i) => i !== index);
    onSetsChange(updatedSets);
  };

  const toggleSetEdit = (index: number) => {
    setEditingIndex(editingIndex === index ? null : index);
  };

  const handleSetSubmit = (index: number) => {
    const setToValidate = sets[index];
    if (validateSet(setToValidate)) {
      setEditingIndex(null);
    }
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
                name="reps"
                type="number"
                value={set.reps || ""}
                onChange={(e) => handleSetChange(index, "reps", e.target.value)}
                placeholder="Reps"
              />
              <Input
                name="weight"
                type="number"
                value={set.weight || ""}
                onChange={(e) =>
                  handleSetChange(index, "weight", e.target.value)
                }
                placeholder="Weight"
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
                onClick={() => handleSetSubmit(index)}
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
          <Button type="button" onClick={addSet} variant="secondary">
            <Plus className="mr-1 h-5 w-5 hidden xs:block" />
            Add Set
          </Button>
        </div>
      )}
      {errors && (
        <div className="pt-2">
          <Alert variant="destructive">
            <AlertDescription>
              <p className="whitespace-pre-wrap">{errors}</p>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
