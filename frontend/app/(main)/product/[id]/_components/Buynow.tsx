import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'

interface BuynowProps {
    onClick: () => void;
    disabled?: boolean;
    isLoading?: boolean;
}

const Buynow = ({ onClick, disabled, isLoading }: BuynowProps) => {
    return (
        <Button
            onClick={onClick}
            disabled={disabled || isLoading}
            className="flex h-12 text-slate-900 items-center gap-2 justify-center rounded-lg bg-secondary border-secondary hover:border-secondary/90 hover:bg-secondary/90! border-solid transition-all cursor-pointer duration-300 ease-in-out flex-1 border px-6 py-2 text-sm font-medium"
        >
            {isLoading ? <Spinner className="size-4" /> : <ShoppingBag className="size-5! mr-1" />}
            Buy Now
        </Button>
    )
}

export default Buynow