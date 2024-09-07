import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteExerciseButton from "./DeleteExerciseButton";
import EditExerciseButton from "./EditExerciseButton";

export default function ExerciseCard({
  exercise,
  onUpdate,
  onDelete,
  index,
}: ExerciseCardProps) {
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
          <p>Reps: {exercise.reps}</p>
          <p>Sets: {exercise.sets}</p>
          <p>Weight: {exercise.weight} kg</p>
          <div className="flex justify-end gap-2 mt-4">
            <EditExerciseButton exercise={exercise} onUpdate={onUpdate} />
            <DeleteExerciseButton
              exerciseId={exercise._id!}
              onDelete={onDelete}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
