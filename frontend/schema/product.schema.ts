import { ProductStatus } from "@/types/product";
import z from "zod";

const productSchema = z.object({
  productname: z.string().min(3, "Product name is required"),
  description: z.string().min(10, "Description must be detailed"),
  brand: z.string().optional(),
  gender: z.string().default("UNISEX"),
  status: z.nativeEnum(ProductStatus).default(ProductStatus.DRAFT),
  is_track_inventory: z.boolean().default(true),
  category_ids: z.array(z.string()).min(1, "At least one category is required"), 
  images: z.array(z.object({
    file: z.any().refine((file) => file instanceof File, "Image is required"),
    isprimary: z.boolean()
  })).min(1, "At least one image is required"),
  variants: z.array(z.object({
    size: z.string().optional(),
    price_override: z.number().min(0),
    offer_price_override: z.number().optional(),
    stock_quantity: z.number().min(0),
    sku: z.string().optional()
  })).min(1, "At least one variant is required")
})

export type ProductFormSubmitValues = z.output<typeof productSchema>;
export type ProductFormValues = z.input<typeof productSchema>;

export default productSchema;
