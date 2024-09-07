"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import ExerciseList from "@/components/ExerciseList";
import AddExerciseDialog from "@/components/AddExerciseDialog";
import { Button } from "@/components/ui/button";
import { BicepsFlexed, Loader2Icon, Plus } from "lucide-react";
import { redirectToSignIn } from "@/utils/redirect";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  if (isLoaded && !user) {
    redirectToSignIn();
  }

  useEffect(() => {
    const fetchExercises = async () => {
      if (!isLoaded || !user) return;

      try {
        setIsLoading(true);
        const response = await fetch("/api/exercises");
        if (!response.ok) {
          throw new Error("Failed to fetch exercises");
        }
        const data = await response.json();
        setExercises(data);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [user, isLoaded]);

  const addExercise = async (
    exercise: Omit<Exercise, "_id" | "userId" | "userName">
  ) => {
    try {
      setIsAdding(true);
      const response = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exercise),
      });
      if (!response.ok) {
        throw new Error("Failed to add exercise");
      }
      const newExercise = await response.json();
      setExercises((prevExercises) => [...prevExercises, newExercise]);
      setShowAddDialog(false);
    } catch (error) {
      console.error("Error adding exercise:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const updateExercise = async (updatedExercise: Exercise) => {
    try {
      const response = await fetch(`/api/exercises/${updatedExercise._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedExercise),
      });
      if (!response.ok) {
        throw new Error("Failed to update exercise");
      }
      const updated = await response.json();
      setExercises((prevExercises) =>
        prevExercises.map((ex) => (ex._id === updated._id ? updated : ex))
      );
    } catch (error) {
      console.error("Error updating exercise:", error);
    }
  };

  const deleteExercise = async (id: string) => {
    try {
      const response = await fetch(`/api/exercises/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete exercise");
      }
      setExercises((prevExercises) =>
        prevExercises.filter((ex) => ex._id !== id)
      );
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh text-white">
        <BicepsFlexed className="animate-bounce h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-3xl font-bold text-center text-white"
      >
        Welcome, {user?.firstName}!
      </motion.h1>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center text-white">
          <Loader2Icon className="h-8 w-8 animate-spin" />
          <p>Loading...</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-center m-4">
            <Button onClick={() => setShowAddDialog(true)} variant="secondary">
              <Plus />
              Add Exercise
            </Button>
            <AddExerciseDialog
              isOpen={showAddDialog}
              onClose={() => setShowAddDialog(false)}
              onSubmit={addExercise}
              isAdding={isAdding}
            />
          </div>
          {exercises.length > 0 ? (
            <ExerciseList
              exercises={exercises}
              onUpdate={updateExercise}
              onDelete={deleteExercise}
            />
          ) : (
            <div className="text-center text-white">
              <p>No exercises found. Add your first exercise!</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
