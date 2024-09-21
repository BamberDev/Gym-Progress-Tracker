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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { groupSchema } from "@/utils/zodSchema/groupSchema";
import { validateForm } from "@/utils/zodSchema/validateForm";

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setGroup((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateFormForGroup = () => {
    const { valid, errors: validationErrors } = validateForm(
      groupSchema,
      group
    );
    setErrors(validationErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFormForGroup()) {
      return;
    }
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Group</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <div>
            <Input
              name="name"
              placeholder="Group name"
              value={group.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Textarea
              name="description"
              placeholder="Group description"
              value={group.description}
              onChange={handleChange}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isAdding}
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
          {(errors.name || errors.description) && (
            <Alert variant="destructive">
              <AlertDescription>
                {errors.name || errors.description}
              </AlertDescription>
            </Alert>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
