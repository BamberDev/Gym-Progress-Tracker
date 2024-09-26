import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { clientGroupSchema, validateForm } from "@/utils/zodSchema";
import { useErrorTimeout } from "@/hooks/useErrorTimeout";
import ErrorAlert from "./ErrorAlert";

export default function EditGroupDialog({
  group,
  onUpdate,
  isOpen,
  onClose,
}: EditGroupDialogProps) {
  const [editedGroup, setEditedGroup] = useState<Group>(group);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const { clearErrorTimer, clearExistingTimer } = useErrorTimeout(() =>
    setFetchError(null)
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedGroup((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateFormForEditGroup = () => {
    const { valid, errors: validationErrors } = validateForm(
      clientGroupSchema,
      editedGroup
    );
    setErrors(validationErrors);
    return valid;
  };

  const handleUpdate = async () => {
    if (!validateFormForEditGroup()) return;
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/groups/${editedGroup._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedGroup),
      });
      if (!response.ok) {
        throw new Error("Failed to update group. Please try again later.");
      }
      const updatedGroup = await response.json();
      onUpdate(updatedGroup);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setFetchError(error.message);
      } else {
        setFetchError("An unexpected error occurred.");
      }
      clearExistingTimer();
      clearErrorTimer();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        onClose();
        clearErrorTimer();
        setFetchError(null);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
          <DialogDescription className="sr-only">
            Edit group dialog
          </DialogDescription>
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
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              variant="secondary"
              type="submit"
              className="w-full"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-1 h-5 w-5 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
          {(errors.name || errors.description || fetchError) && (
            <ErrorAlert
              alertDescription={errors.name || errors.description || fetchError}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
