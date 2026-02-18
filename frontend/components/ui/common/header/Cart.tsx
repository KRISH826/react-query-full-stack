import React from 'react'
import { Button } from '../../button'
import { ShoppingBag } from 'lucide-react'

const Cart = () => {
    return (
        <>
            {/* Cart */}
            <Button
                variant="ghost"
                size="icon"
                className="relative"
            >
                <ShoppingBag className="h-5 w-5" />

                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                    3
                </span>
            </Button>
        </>
    )
}

export default Cart