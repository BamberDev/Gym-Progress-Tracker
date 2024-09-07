type Exercise = {
  _id?: string;
  userId: string;
  userName: string;
  name: string;
  reps: number;
  sets: number;
  weight: number;
};

type ExerciseListProps = {
  exercises: Exercise[];
  onUpdate: (exercise: Exercise) => void;
  onDelete: (id: string) => void;
};

type ExerciseCardProps = {
  exercise: Exercise;
  onUpdate: (exercise: Exercise) => void;
  onDelete: (id: string) => void;
  index: number;
};

type AddExerciseDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (exercise: Omit<Exercise, "_id" | "userId" | "userName">) => void;
  isAdding: boolean;
};

type DeleteExerciseButtonProps = {
  exerciseId: string;
  onDelete: (id: string) => void;
};

type EditExerciseButtonProps = {
  exercise: Exercise;
  onUpdate: (exercise: Exercise) => void;
};
