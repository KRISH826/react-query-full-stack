import { useUpdateCartMutation } from '@/services/cartApi'
import { CartItem } from '@/types/cart'
import { Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import DeleteCartProduct from './DeleteCartProduct'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

type cart = {
    cart: CartItem
}

const CartItems = ({ cart }: cart) => {
    const [updateCart] = useUpdateCartMutation();
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const [quantity, setQuantity] = useState(cart.quantity);
    const handleUpdateCart = async (newQuantity: number) => {
        if (newQuantity < 1) return;
        setQuantity(newQuantity);
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            try {
                updateCart({
                    product_id: cart.productId,
                    variant_id: cart.variantId,
                    quantity: newQuantity
                }).unwrap();
            } catch (error: unknown) {
                setQuantity(cart.quantity);
                const err = error as { data?: { message?: string } };
                const errorMessage = err?.data?.message || "Failed to create product.";
                toast.error(errorMessage);
            }
        }, 200);
    }
    return (
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-xl bg-linear-to-l from-primary/2 shadow-sm to-secondary/15 border border-gray-200 p-4">
            <div className="relative h-28 w-full sm:w-28 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <Image
                    src={cart.imageUrl || '/placeholder.png'}
                    alt="product"
                    fill
                    className="object-cover"
                />
            </div>

            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <h2 className="text-base md:text-lg font-medium text-gray-900">
                        {cart.productName}
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                        {cart.brand}
                    </p>
                    {cart.size && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                            Size: {cart.size}
                        </span>
                    )}
                </div>
                <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
                    <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden">
                        <button onClick={() => handleUpdateCart(quantity - 1)} disabled={quantity === 1} className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center hover:bg-gray-100 transition">
                            <Minus size={14} className="sm:size-4" />
                        </button>
                        <span className="h-9 w-10 sm:h-10 sm:w-12 flex items-center justify-center text-xs md:text-sm font-medium">
                            {quantity}
                        </span>
                        <button onClick={() => handleUpdateCart(quantity + 1)} className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center hover:bg-gray-100 transition">
                            <Plus size={14} className="sm:size-4" />
                        </button>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                        <span className="text-[15px] md:text-lg font-semibold text-gray-900">
                            {
                                cart.offerPrice ? <>₹{cart.offerPrice}</> : <>₹{cart.price}</>
                            }

                        </span>
                        <DeleteCartProduct id={cart.variantId} />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default CartItems