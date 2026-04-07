"use client";

import dynamic from "next/dynamic";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "@/schema/product.schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useGetAllCategoriesQuery } from "@/services/categoryApi";
import { ProductStatus } from "@/types/product";
import 'react-quill-new/dist/quill.snow.css';
import { MultiSelect } from "@/components/ui/multi-select";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-32 w-full bg-muted animate-pulse rounded-md" />
});

export function BasicInfo({ form }: { form: UseFormReturn<ProductFormValues> }) {
  const { data: categories } = useGetAllCategoriesQuery();
  const categoiresData = categories?.map((category) => ({
    value: category.id,
    label: category.name,
  })) || [];

  return (
    <Card className="py-0! mb-0! shadow-none! border-0">
      <CardHeader>
        <CardTitle className="lg:text-2xl text-xl">Basic Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="productname"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Slim Fit Cotton Shirt" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Brand</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Zara" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="UNISEX">Unisex</SelectItem>
                    <SelectItem value="KIDS">Kids</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Publish Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ProductStatus).map((s) => (
                      <SelectItem key={s} value={s}>{s.toUpperCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Description</FormLabel>
              <FormControl>
                <div className="h-48 mb-0!">
                  <ReactQuill theme="snow" value={field.value} onChange={field.onChange} className="h-32" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category_ids"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Assign Categories</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={categoiresData}
                    selected={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_track_inventory"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border py-2 px-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="font-semibold">Track Inventory</FormLabel>
                  <p className="text-sm text-muted-foreground">Automatically track stock levels</p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}