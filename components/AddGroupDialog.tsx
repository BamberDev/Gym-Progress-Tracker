import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function AddGroupDialog({
  isOpen,
  onClose,
  onSubmit,
}: AddGroupDialogProps) {
  const initialGroupState: NewGroup = {
    name: "",
    description: "",
  };

  const [group, setGroup] = useState<NewGroup>(initialGroupState);
  const [isAdding, setIsAdding] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setGroup((prev) => ({ ...prev, [name]: value }));
  };

  const addGroup = async (group: NewGroup) => {
    try {
      setIsAdding(true);
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(group),
      });
      if (!response.ok) {
        throw new Error("Failed to add group");
      }
      const newGroup = await response.json();
      onSubmit(newGroup);
      setGroup(initialGroupState);
    } catch (error) {
      console.error("Error adding group:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addGroup(group);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <Input
            name="name"
            placeholder="Group name"
            value={group.name}
            onChange={handleChange}
            required
          />
          <Textarea
            name="description"
            placeholder="Group description"
            value={group.description}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            disabled={isAdding || group.name === "" || group.description === ""}
            variant="secondary"
            className="w-full"
          >
            {isAdding ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-1 h-5 w-5" />
                Add Group
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
