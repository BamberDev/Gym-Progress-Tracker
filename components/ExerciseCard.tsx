import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteExerciseButton from "./DeleteExerciseButton";
import EditExerciseButton from "./EditExerciseButton";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default function ExerciseCard({
  exercise,
  onUpdate,
  onDelete,
  index,
}: ExerciseCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="bg-[#1f1f23] border-[#26252a] text-white">
        <CardHeader>
          <CardTitle>{exercise.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {exercise.restTime && <p>Rest Time - {exercise.restTime} min</p>}
          {exercise.sets.map((set, index) => (
            <p key={index}>
              Set {index + 1} - {set.reps} reps x {set.weight} kg
            </p>
          ))}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-5 w-5 text-black" />
            </Button>
            <DeleteExerciseButton
              exerciseId={exercise._id!}
              onDelete={onDelete}
            />
          </div>
        </CardContent>
      </Card>
      <EditExerciseButton
        exercise={exercise}
        onUpdate={onUpdate}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
      />
    </motion.div>
  );
}
