import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UseFormReturn } from 'react-hook-form'
import { ProductFormValues } from '@/schema/product.schema'
import { useFieldArray } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Plus, ShoppingBasket, Trash2 } from 'lucide-react'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "36", "38", "40", "42", "44", "One Size"];

const ProductVariants = ({ form }: { form: UseFormReturn<ProductFormValues> }) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "variants"
    });
    return (
        <Card className='border-0 shadow-none gap-0 mb-0! bg-transparent'>
            <CardHeader className='flex flex-row items-center justify-between gap-4'>
                <CardTitle className='text-2xl font-semibold'>Variants</CardTitle>
                <Button
                    type="button"
                    size="sm"
                    onClick={() => append({ sku: "", size: "M", price_override: null, offer_price_override: null, stock_quantity: null })}
                >
                    <Plus className="w-4 h-4" /> Add Variant
                </Button>
            </CardHeader>
            <CardContent>
                <div>
                    {
                        fields.length === 0 ? (
                            <>
                                <div className="col-span-full py-10 mt-6 flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-muted/10">
                                    <ShoppingBasket className="w-10 h-10 text-muted-foreground/20 mb-2" />
                                    <p className="text-sm text-muted-foreground">No variants added yet.</p>
                                </div>
                            </>
                        ) : (
                            <>
                                {
                                    fields.map((field, index) => (
                                        <div key={field.id} className='grid mt-6 grid-cols-5 gap-4'>
                                            <div>
                                                <FormField
                                                    control={form.control}
                                                    name={`variants.${index}.sku`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>SKU</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="SKU" value={field.value ?? ""} onChange={e => field.onChange(e.target.value)} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className='w-full'>
                                                <FormField
                                                    control={form.control}
                                                    name={`variants.${index}.size`}
                                                    render={({ field }) => (
                                                        <FormItem className='w-full'>
                                                            <FormLabel>Size</FormLabel>
                                                            <Select onValueChange={field.onChange} value={field.value ?? ""} defaultValue={field.value ?? ""}>
                                                                <FormControl className='w-full'>
                                                                    <SelectTrigger className='w-full'>
                                                                        <SelectValue placeholder="Select Size" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent position='popper'>
                                                                    {SIZE_OPTIONS.map((size) => (
                                                                        <SelectItem key={size} value={size}>
                                                                            {size}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div>
                                                <FormField
                                                    control={form.control}
                                                    name={`variants.${index}.price_override`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Price Override</FormLabel>
                                                            <FormControl>
                                                                <Input min={0} type='number' placeholder="Price Override" name={field.name} onBlur={field.onBlur} ref={field.ref} disabled={field.disabled} value={(field.value ?? "") as string | number} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div>
                                                <FormField
                                                    control={form.control}
                                                    name={`variants.${index}.offer_price_override`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Offer Price Override</FormLabel>
                                                            <FormControl>
                                                                <Input type='number' placeholder="Offer Price Override" name={field.name} onBlur={field.onBlur} ref={field.ref} disabled={field.disabled} value={(field.value ?? "") as string | number} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className='flex items-end gap-2'>
                                                <div className='flex-1'>
                                                    <FormField
                                                        control={form.control}
                                                        name={`variants.${index}.stock_quantity`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Stock Quantity</FormLabel>
                                                                <FormControl>
                                                                    <Input type='number' placeholder="Stock Quantity" name={field.name} onBlur={field.onBlur} ref={field.ref} disabled={field.disabled} value={(field.value ?? "") as string | number} onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <Button
                                                    size="icon"
                                                    type="button"
                                                    variant="destructive"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </>
                        )
                    }

                </div>
            </CardContent>
        </Card>
    )
}

export default ProductVariants
