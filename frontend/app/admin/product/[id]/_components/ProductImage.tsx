"use client"

import React, { memo, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { ProductFormValues } from '@/schema/product.schema'
import { Button } from '@/components/ui/button'
import { Plus, Image as ImageIcon, Trash2, Star } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { useDeleteProductImageMutation } from '@/services/productApi'

// 1. Separate Preview Component to handle memory & prevent flickering
const PreviewItem = memo(({ file, url }: { file: File, url?: string }) => {
    const [preview, setPreview] = useState<string>(url || "");

    useEffect(() => {
        if (file instanceof File) {
            const objectUrl = URL.createObjectURL(file);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else if (url) {
            setPreview(url);
        }
    }, [file, url]);

    if (!preview) return null;

    return (
        <Image
            src={preview}
            alt="preview"
            fill
            className="object-cover"
        />
    );
});

PreviewItem.displayName = "PreviewItem";

const ProductImage = ({ form }: { form: UseFormReturn<ProductFormValues> }) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "images"
    });
    const [deleteProductImage, { isLoading: isDeleting }] = useDeleteProductImageMutation();
    const handleFile = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue(`images.${index}.file`, file);
            form.setValue(`images.${index}.url`, ""); // Clear URL if a new file is uploaded
            if (index === 0) form.setValue(`images.${index}.isprimary`, true);
            toast.success("Image uploaded successfully");
        }
    };
    const makePrimary = (index: number) => {
        const currentImages = form.getValues("images");
        currentImages.forEach((_, i) => form.setValue(`images.${i}.isprimary`, i === index));
    };

    const handleRemove = async (index: number) => {
        const currentImages = form.getValues("images");
        const imageToDelete = currentImages[index];
        const imageId = imageToDelete?.id;
        console.log("Deleting Image Data:", imageToDelete);
        console.log("Image ID:", imageId);
        if (imageToDelete.isprimary) {
            toast.error("Cannot remove primary image");
            return;
        }
        if (imageId) {
            try {
                await deleteProductImage(imageId).unwrap();
                toast.success("Image deleted successfully");
            } catch (error) {
                toast.error("Failed to delete image");
                return
            }
        } else {
            toast.success("Local Image removed successfully");
        }
        remove(index);
    }

    return (
        <Card className="border-0 mb-0! shadow-none bg-transparent">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold">Media Gallery</CardTitle>
                <Button
                    type="button"
                    size="sm"
                    onClick={() => append({ file: null, isprimary: false, url: "" })}
                >
                    <Plus className="w-4 h-4" /> Add Slot
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {fields.map((field, index) => {
                        const file = form.watch(`images.${index}.file`);
                        const isPrimary = form.watch(`images.${index}.isprimary`);
                        const url = form.watch(`images.${index}.url`);
                        const id = form.watch(`images.${index}.id`);
                        return (
                            <div key={field.id} className="group relative aspect-square border border-dashed rounded-xl bg-muted/20 hover:border-primary/50 transition-all overflow-hidden">
                                <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant={isPrimary ? "default" : "secondary"}
                                        className="h-7 w-7"
                                        onClick={() => makePrimary(index)}
                                    >
                                        <Star className={`h-4 w-4 ${isPrimary ? "fill-current" : ""}`} />
                                    </Button>
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="destructive"
                                        disabled={isDeleting}
                                        className="h-7 w-7"
                                        onClick={() => handleRemove(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                {(file || url) ? (
                                    <PreviewItem file={file as File} url={url} />
                                ) : (
                                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-muted/50 transition-colors">
                                        <ImageIcon className="w-8 h-8 text-muted-foreground/40 mb-2" />
                                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Upload</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => handleFile(index, e)}
                                        />
                                    </label>
                                )}

                                {isPrimary && (
                                    <div className="absolute bottom-2 left-2 bg-primary text-[10px] text-white px-2 py-0.5 rounded-full font-bold">
                                        Main
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    {fields.length === 0 && (
                        <div className="col-span-full py-10 flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/10">
                            <ImageIcon className="w-10 h-10 text-muted-foreground/20 mb-2" />
                            <p className="text-sm text-muted-foreground">No images added yet.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default ProductImage