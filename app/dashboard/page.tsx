"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BicepsFlexed, Plus } from "lucide-react";
import redirectToSignIn from "@/utils/redirect";
import AddGroupDialog from "@/components/AddGroupDialog";
import GroupList from "@/components/GroupList";
import Loader from "@/components/Loader";
import SearchBar from "@/components/SearchBar";
import GoBackButton from "@/components/GoBackButton";

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh text-white">
        <BicepsFlexed className="animate-bounce h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <GoBackButton />
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
          <div className="flex flex-col items-center m-4 space-y-4">
            <Button onClick={() => setShowAddDialog(true)} variant="secondary">
              <Plus className="mr-2 h-5 w-5" /> Add Group
            </Button>
            <AddGroupDialog
              isOpen={showAddDialog}
              onClose={() => setShowAddDialog(false)}
              onSubmit={handleAddGroup}
            />
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Find group..."
            />
          </div>
          {filteredGroups.length > 0 ? (
            <GroupList
              groups={filteredGroups}
              onUpdate={handleUpdateGroup}
              onDelete={handleDeleteGroup}
            />
          ) : (
            <div className="text-center text-white">
              <p>
                {searchTerm
                  ? "No groups found matching your search."
                  : "No groups found. Add your first group!"}
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
