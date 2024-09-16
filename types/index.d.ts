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
  restTime: string;
  sets: ExerciseSet[];
};

type NewExercise = {
  name: string;
  restTime: string;
  sets: ExerciseSet[];
  groupId: string;
};

type Group = {
  _id?: string;
  userId: string;
  name: string;
  description: string;
};

type NewGroup = Omit<Group, "_id" | "userId">;

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

type DeleteConfirmationDialogProps = {
  onDelete: () => void;
  entityName: string;
  isDeleting: boolean;
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

type GroupListProps = {
  groups: Group[];
  onUpdate: (group: Group) => void;
  onDelete: (id: string) => void;
};

type GroupCardProps = {
  group: Group;
  onUpdate: (group: Group) => void;
  onDelete: (id: string) => void;
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

type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  placeholder: string;
};
