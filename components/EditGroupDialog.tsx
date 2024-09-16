import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function EditGroupDialog({
  group,
  onUpdate,
  isOpen,
  onClose,
}: EditGroupDialogProps) {
  const [editedGroup, setEditedGroup] = useState<Group>(group);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedGroup((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/groups/${editedGroup._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedGroup),
      });
      if (!response.ok) {
        throw new Error("Failed to update group");
      }
      const updatedGroup = await response.json();
      onUpdate(updatedGroup);
      onClose();
    } catch (error) {
      console.error("Error updating group:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1f1f23] border-[#26252a] text-white">
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-black">
          <Input
            name="name"
            placeholder="Group name"
            value={editedGroup.name}
            onChange={handleChange}
            required
          />
          <Textarea
            name="description"
            placeholder="Group description"
            value={editedGroup.description}
            onChange={handleChange}
            required
          />
          <div className="flex justify-end gap-2">
            <Button variant="destructive" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={
                isUpdating ||
                editedGroup.name === "" ||
                editedGroup.description === ""
              }
              variant="secondary"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
