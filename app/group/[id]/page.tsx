"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import ExerciseList from "@/components/ExerciseList";
import AddExerciseDialog from "@/components/AddExerciseDialog";
import { Button } from "@/components/ui/button";
import { BicepsFlexed, MoveLeft, Plus } from "lucide-react";
import redirectToSignIn from "@/utils/redirect";
import Link from "next/link";
import Loader from "@/components/Loader";

export default function GroupPage({ params }: { params: { id: string } }) {
  const { user, isLoaded } = useUser();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  if (isLoaded && !user) {
    redirectToSignIn();
  }

  useEffect(() => {
    const fetchGroupAndExercises = async () => {
      if (!isLoaded || !user) return;
      try {
        setIsLoading(true);
        const groupResponse = await fetch(`/api/groups/${params.id}`);
        const exercisesResponse = await fetch(
          `/api/exercises?groupId=${params.id}`
        );
        if (!groupResponse.ok || !exercisesResponse.ok) {
          throw new Error("Failed to fetch data");
        }
        const groupData = await groupResponse.json();
        const exercisesData = await exercisesResponse.json();
        setGroup(groupData);
        setExercises(exercisesData);
      } catch (error) {
        console.error("Error fetching data:", error);
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

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh text-white">
        <BicepsFlexed className="animate-bounce h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Link href="/dashboard">
        <Button variant="secondary">
          <MoveLeft className=" h-5 w-5" />
        </Button>
      </Link>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-center text-white">
            {group?.name}
          </h1>
          <div className="flex justify-center m-4">
            <Button onClick={() => setShowAddDialog(true)} variant="secondary">
              <Plus /> Add Exercise
            </Button>
            <AddExerciseDialog
              isOpen={showAddDialog}
              onClose={() => setShowAddDialog(false)}
              onSubmit={handleAddExercise}
              groupId={params.id}
            />
          </div>
          {exercises.length > 0 ? (
            <ExerciseList
              exercises={exercises}
              onUpdate={handleUpdateExercise}
              onDelete={handleDeleteExercise}
            />
          ) : (
            <div className="text-center text-white">
              <p>No exercises found. Add your first exercise!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
