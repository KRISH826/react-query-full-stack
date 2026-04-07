import { ProductStatus } from "@/types/product";
import z from "zod";

const productSchema = z.object({
  productname: z.string().min(3, "Product name is required"),
  description: z.string().min(10, "Description must be detailed"),
  brand: z.string().optional(),
  gender: z.string().default("UNISEX"),
  status: z.nativeEnum(ProductStatus).default(ProductStatus.DRAFT),
  is_track_inventory: z.boolean().default(true),
  category_names: z.array(z.string()).min(1, "At least one category is required"),
  images: z.array(z.object({
    file: z.any().optional().nullable(),
    url: z.string().optional(),
    isprimary: z.boolean()
  })).min(1, "At least one image is required"),
  variants: z.array(z.object({
    size: z.string().optional().nullable(),
    price_override: z.coerce.number().optional().nullable(),
    offer_price_override: z.coerce.number().optional().nullable(),
    stock_quantity: z.coerce.number().optional().nullable(),
    sku: z.string().optional().nullable()
  })).min(1, "At least one variant is required")
})

export type ProductFormSubmitValues = z.output<typeof productSchema>;
export type ProductFormValues = z.input<typeof productSchema>;

export default productSchema;
