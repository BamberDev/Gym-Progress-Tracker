// Exercise-related types
type ExerciseSet = {
  reps: number;
  weight: number;
};

type Exercise = {
  _id?: string;
  groupId: string;
  userId: string;
  userName: string;
  name: string;
  restTime: number | null;
  sets: ExerciseSet[];
  history?: HistoryEntry[];
};

type HistoryEntry = {
  date: string;
  averageWeight: number;
  averageReps: number;
};

type ExerciseHistoryProps = {
  history: HistoryEntry[];
  exerciseName: string;
  isOpen: boolean;
  onClose: () => void;
};

type NewExercise = {
  name: string;
  restTime: number | null;
  sets: ExerciseSet[];
  groupId: string;
};

// Group-related types
type Group = {
  _id?: string;
  userId: string;
  name: string;
  description: string;
};

type NewGroup = Omit<Group, "_id" | "userId">;

// Component Props related to Exercises
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
  groupId: string;
};

type EditExerciseButtonProps = {
  exercise: Exercise;
  onUpdate: (exercise: Exercise) => void;
  isOpen: boolean;
  onClose: () => void;
};

type ExerciseSetsManagerProps = {
  sets: ExerciseSet[];
  onSetsChange: (updatedSets: ExerciseSet[]) => void;
  isEditable?: boolean;
};

// Component Props related to Groups
type GroupListProps = {
  groups: Group[];
  onUpdate: (group: Group) => void;
  onDelete: (id: string) => void;
};

type GroupCardProps = {
  group: Group;
  onUpdate: (group: Group) => void;
  onDelete: (id: string) => void;
  index: number;
};

type AddGroupDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (group: NewGroup) => void;
};

type EditGroupDialogProps = {
  group: Group;
  onUpdate: (group: Group) => void;
  isOpen: boolean;
  onClose: () => void;
};

// Utility Component Props
type DeleteConfirmationDialogProps = {
  onDelete: () => void;
  entityName: string;
};

type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder: string;
};
