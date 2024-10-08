"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import ExerciseList from "@/components/ExerciseList";
import AddExerciseDialog from "@/components/AddExerciseDialog";
import { Button } from "@/components/ui/button";
import { BicepsFlexed, Plus } from "lucide-react";
import redirectToSignIn from "@/utils/redirect";
import Loader from "@/components/Loader";
import SearchBar from "@/components/SearchBar";
import { motion } from "framer-motion";
import GoBackButton from "@/components/GoBackButton";
import ErrorAlert from "@/components/ErrorAlert";

export default function GroupPage({ params }: { params: { id: string } }) {
  const { user, isLoaded } = useUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !user) {
      redirectToSignIn();
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const fetchGroupAndExercises = async () => {
      if (!isLoaded || !user) return;
      try {
        setIsLoading(true);
        setFetchError(null);
        const groupResponse = await fetch(`/api/groups/${params.id}`);
        const exercisesResponse = await fetch(
          `/api/exercises?groupId=${params.id}`
        );
        if (!groupResponse.ok || !exercisesResponse.ok) {
          throw new Error("Failed to fetch data. Please try again later.");
        }
        const groupData = await groupResponse.json();
        const exercisesData = await exercisesResponse.json();
        setGroup(groupData);
        setExercises(exercisesData);
      } catch (error) {
        if (error instanceof Error) {
          setFetchError(error.message);
        } else {
          setFetchError("An unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupAndExercises();
  }, [user, isLoaded, params.id]);

  const handleAddExercise = (newExercise: NewExercise) => {
    setExercises((prevExercises) => [
      ...prevExercises,
      {
        ...newExercise,
        userId: user?.id || "",
        userName: `${user?.firstName} ${user?.lastName}`,
      },
    ]);
    setShowAddDialog(false);
  };

  const handleUpdateExercise = (updatedExercise: Exercise) => {
    setExercises((prevExercises) =>
      prevExercises.map((ex) =>
        ex._id === updatedExercise._id ? updatedExercise : ex
      )
    );
  };

  const handleDeleteExercise = (id: string) => {
    setExercises((prevExercises) =>
      prevExercises.filter((ex) => ex._id !== id)
    );
  };

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh text-white">
        <BicepsFlexed className="animate-bounce h-10 w-10" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center w-[80%] max-w-lg h-[90svh] m-auto">
        <ErrorAlert alertDescription={fetchError} />;
        <GoBackButton />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <GoBackButton />
      {isLoading ? (
        <Loader />
      ) : (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="mb-6 mt-1 text-3xl font-bold text-center text-white truncate">
            {group?.name}
          </h1>
          <div className="flex flex-col items-center m-4 space-y-4">
            <Button onClick={() => setShowAddDialog(true)} variant="secondary">
              <Plus className="mr-1 h-5 w-5" /> Add Exercise
            </Button>
            <AddExerciseDialog
              isOpen={showAddDialog}
              onClose={() => setShowAddDialog(false)}
              onSubmit={handleAddExercise}
              groupId={params.id}
            />
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Find exercise..."
            />
          </div>
          {filteredExercises.length > 0 ? (
            <ExerciseList
              exercises={filteredExercises}
              onUpdate={handleUpdateExercise}
              onDelete={handleDeleteExercise}
            />
          ) : (
            <div className="text-center text-white">
              <p>
                {searchTerm
                  ? "No exercises found matching your search."
                  : "No exercises found. Add your first exercise!"}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
