"use client"
import { Button } from '../../button'
import { ShoppingCart } from 'lucide-react'
import { useGetCartQuery } from '@/services/cartApi'
import { useRouter } from 'next/navigation';
import { useGetProfileQuery } from '@/services/userApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const Cart = () => {
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const { data } = useGetCartQuery(undefined, { skip: !token });
    const { data: user, isLoading } = useGetProfileQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
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
        <Button
            variant="ghost"
            onClick={handleCart}
            className="relative hidden sm:inline-flex items-center gap-1.5 px-3 h-9 cursor-pointer"
        >
            <ShoppingCart className="h-4 w-4" />
            <span className="text-xs font-medium">Cart</span>
            {
                (data?.items?.length ?? 0) > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                        {data?.items?.length}
                    </span>
                )
            }
        </Button>
    )
}

export default Cart