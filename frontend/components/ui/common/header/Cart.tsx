"use client"
import { Button } from '../../button'
import { ShoppingBag } from 'lucide-react'
import { useGetCartQuery } from '@/services/cartApi'
import { useRouter } from 'next/navigation';
import { useGetProfileQuery } from '@/services/userApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const Cart = () => {
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const { data } = useGetCartQuery(undefined, { skip: !token });
    const { data: user, isLoading } = useGetProfileQuery(undefined, {
        skip: !token
    });
    const router = useRouter();
    const handleCart = () => {
        if (!user && !isLoading) {
            router.push('/login')
            return;
        }
        router.push('/carts')
    }
    return (
        <>
            {/* Cart */}
            <Button
                variant="ghost"
                onClick={handleCart}
                size="icon"
                className="relative"
            >
                <ShoppingBag className="h-5 w-5" />
                {
                    (data?.items?.length ?? 0) > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                            {data?.items?.length}
                        </span>
                    )
                }
            </Button>
        </>
    )
}

export default Cart