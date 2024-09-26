import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, TrendingUp } from "lucide-react";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import EditExerciseDialog from "./EditExerciseDialog";
import ExerciseHistory from "./ExerciseHistory";
import { useErrorTimeout } from "@/hooks/useErrorTimeout";
import ErrorAlert from "./ErrorAlert";

export default function ExerciseCard({
  exercise,
  onUpdate,
  onDelete,
  index,
}: ExerciseCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [checkedSets, setCheckedSets] = useState<boolean[]>(
    new Array(exercise.sets.length).fill(false)
  );
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { clearErrorTimer, clearExistingTimer } = useErrorTimeout(() =>
    setFetchError(null)
  );

  const handleCheckboxChange = (setIndex: number) => {
    const updatedCheckedSets = [...checkedSets];
    updatedCheckedSets[setIndex] = !updatedCheckedSets[setIndex];
    setCheckedSets(updatedCheckedSets);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/exercises/${exercise._id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete exercise. Please try again later.");
      }
      onDelete(exercise._id!);
    } catch (error) {
      if (error instanceof Error) {
        setFetchError(error.message);
      } else {
        setFetchError("An unexpected error occurred.");
      }
      clearExistingTimer();
      clearErrorTimer();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{exercise.name}</CardTitle>
        </CardHeader>
        <CardContent className="sm:text-[18px]">
          {exercise.restTime && (
            <p className="mb-2">Rest between sets - {exercise.restTime} min</p>
          )}
          <div className="h-24 sm:h-28 overflow-y-auto break-words">
            {exercise.sets.map((set, setIndex) => (
              <p
                key={setIndex}
                className={`flex items-center gap-1 ${
                  checkedSets[setIndex] && "line-through text-gray-400"
                }`}
              >
                <input
                  type="checkbox"
                  className="w-5 h-5"
                  checked={checkedSets[setIndex]}
                  onChange={() => handleCheckboxChange(setIndex)}
                  aria-label={`Mark Set ${setIndex + 1} as completed`}
                />
                Set {setIndex + 1} - {set.reps} reps x {set.weight} kg
              </p>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={() => setShowHistory(true)}
            >
              <TrendingUp className="h-5 w-5 text-black" />
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-5 w-5 text-black" />
              </Button>
              <DeleteConfirmationDialog
                onDelete={handleDelete}
                entityName="exercise"
              />
            </div>
          </div>
          {fetchError && (
            <div className="mt-2">
              <ErrorAlert alertDescription={fetchError} />
            </div>
          )}
        </CardContent>
      </Card>
      <EditExerciseDialog
        exercise={exercise}
        onUpdate={onUpdate}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
      />
      {exercise.history && exercise.history.length > 0 && (
        <ExerciseHistory
          history={exercise.history}
          exerciseName={exercise.name}
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </motion.div>
  );
}
