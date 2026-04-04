import z from "zod";

const categoryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  slug: z.string().min(2, "Slug is required."),
  isParent: z.boolean().default(true),
  parent_id: z.string().nullable().optional(),
}).refine((data) => {
  if (!data.isParent && !data.parent_id) {
    return false;
  }
  return true;
}, {
  message: "Please select a parent category if this is not a root category.",
  path: ["parent_id"],
});

export type CategoryFormSchema = z.infer<typeof categoryFormSchema>