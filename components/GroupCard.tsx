import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import Link from "next/link";
import EditGroupDialog from "./EditGroupDialog";

export default function GroupCard({
  group,
  onUpdate,
  onDelete,
}: GroupCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/groups/${group._id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete group");
      }
      onDelete(group._id!);
    } catch (error) {
      console.error("Error deleting group:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <Card className="bg-[#1f1f23] border-[#26252a] text-white">
        <CardHeader>
          <CardTitle>{group.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{group.description}</p>
          <div className="flex justify-between items-center">
            <Link href={`/group/${group._id}`}>
              <Button variant="secondary">View Exercises</Button>
            </Link>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-5 w-5 text-black" />
              </Button>
              <DeleteConfirmationDialog
                onDelete={handleDelete}
                entityName="group"
                isDeleting={isDeleting}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <EditGroupDialog
        group={group}
        onUpdate={onUpdate}
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
      />
    </div>
  );
}
