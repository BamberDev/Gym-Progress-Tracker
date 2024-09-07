import ExerciseCard from "./ExerciseCard";

export default function ExerciseList({
  exercises,
  onUpdate,
  onDelete,
}: ExerciseListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {exercises.map((exercise, index) => (
        <ExerciseCard
          key={exercise._id}
          exercise={exercise}
          onUpdate={onUpdate}
          onDelete={onDelete}
          index={index}
        />
      ))}
    </div>
  );
}
