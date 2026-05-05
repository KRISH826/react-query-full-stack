"use client"

import React from "react"// Path check kar lena
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Loader2, Trash2 } from "lucide-react"
import { useDeleteCategoryMutation } from "@/services/categoryApi"
import { Button } from "@/components/ui/button"

interface DeleteCategoryProps {
  id: string
}

export function DeleteCategoryDialog({ id }: DeleteCategoryProps) {
  const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();
  const [open, setOpen] = React.useState(false)

  const handleDelete = async () => {
    try {
      await deleteCategory(id).unwrap()
      toast.success("Category deleted successfully")
      setOpen(false) // Modal close kar do success par
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      const errorMessage = err?.data?.message || "Failed to delete category.";
      toast.error(errorMessage);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="destructive"
          className="h-8 w-8 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation() // Row click event ko rokne ke liye
            setOpen(true) // Modal open kar do
          }}
        >
          <Trash2 size={14} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            This action cannot be undone. This will permanently delete the category
            and remove all associated data from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel
            disabled={isLoading}
            className="font-medium"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault() // Form submission ya default behavior rokne ke liye
              handleDelete()
            }}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Category"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}