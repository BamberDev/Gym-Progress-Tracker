import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import Link from "next/link";
import EditGroupDialog from "./EditGroupDialog";
import ErrorAlert from "./ErrorAlert";
import { useErrorTimeout } from "@/hooks/useErrorTimeout";

export default function GroupCard({
  group,
  onUpdate,
  onDelete,
  index,
}: GroupCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { clearErrorTimer, clearExistingTimer } = useErrorTimeout(() =>
    setFetchError(null)
  );

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/groups/${group._id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete group. Please try again later.");
      }
      onDelete(group._id!);
    } catch (error) {
      if (error instanceof Error) {
        setFetchError(error.message);
      } else {
        setFetchError("An unexpected error occurred.");
      }
      clearExistingTimer();
      clearErrorTimer();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{group.name}</CardTitle>
          <CardDescription>{group.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mt-2">
            <Link href={`/group/${group._id}`}>
              <Button type="button" variant="secondary">
                View Exercises
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-5 w-5 text-black" />
              </Button>
              <DeleteConfirmationDialog
                onDelete={handleDelete}
                entityName="group"
              />
            </div>
          </div>
          {fetchError && (
            <div className="mt-2">
              <ErrorAlert alertDescription={fetchError} />
            </div>
          )}
        </CardContent>
      </Card>
      <EditGroupDialog
        group={group}
        onUpdate={onUpdate}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
      />
    </motion.div>
  );
}
