"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BicepsFlexed, Plus } from "lucide-react";
import redirectToSignIn from "@/utils/redirect";
import { GymTimer } from "@/components/GymTimer";
import AddGroupDialog from "@/components/AddGroupDialog";
import GroupList from "@/components/GroupList";
import Loader from "@/components/Loader";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  if (isLoaded && !user) {
    redirectToSignIn();
  }

  useEffect(() => {
    const fetchGroups = async () => {
      if (!isLoaded || !user) return;
      try {
        setIsLoading(true);
        const response = await fetch("/api/groups");
        if (!response.ok) {
          throw new Error("Failed to fetch groups");
        }
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [user, isLoaded]);

  const handleAddGroup = (newGroup: NewGroup) => {
    setGroups((prevGroups) => [
      ...prevGroups,
      { ...newGroup, userId: user?.id || "" },
    ]);
    setShowAddDialog(false);
  };

  const handleUpdateGroup = (updatedGroup: Group) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group._id === updatedGroup._id ? updatedGroup : group
      )
    );
  };

  const handleDeleteGroup = (id: string) => {
    setGroups((prevGroups) => prevGroups.filter((group) => group._id !== id));
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
        <Loader />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-center m-4">
            <Button onClick={() => setShowAddDialog(true)} variant="secondary">
              <Plus /> Add Group
            </Button>
            <AddGroupDialog
              isOpen={showAddDialog}
              onClose={() => setShowAddDialog(false)}
              onSubmit={handleAddGroup}
            />
          </div>
          {groups.length > 0 ? (
            <GroupList
              groups={groups}
              onUpdate={handleUpdateGroup}
              onDelete={handleDeleteGroup}
            />
          ) : (
            <div className="text-center text-white">
              <p>No groups found. Add your first group!</p>
            </div>
          )}
        </motion.div>
      )}
      <GymTimer />
    </div>
  );
}
