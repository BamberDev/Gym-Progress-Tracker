type ExerciseSet = {
  reps: number;
  weight: number;
};

type Exercise = {
  _id?: string;
  userId: string;
  userName: string;
  name: string;
  restTime: string;
  sets: ExerciseSet[];
};

type NewExercise = Omit<Exercise, "_id" | "userId" | "userName">;

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
  onSubmit: (exercise: NewExercise) => void;
};

type DeleteExerciseButtonProps = {
  exerciseId: string;
  onDelete: (id: string) => void;
};

type EditExerciseButtonProps = {
  exercise: Exercise;
  onUpdate: (exercise: Exercise) => void;
  isOpen: boolean;
  onClose: () => void;
};
