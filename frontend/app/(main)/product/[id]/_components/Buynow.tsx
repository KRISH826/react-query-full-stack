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
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-secondary border-solid bg-secondary px-6 py-2 text-sm font-medium text-slate-900 transition-all duration-300 ease-in-out cursor-pointer hover:border-secondary/90 hover:bg-secondary/90!"
        >
            {isLoading ? <Spinner className="size-4" /> : <ShoppingBag className="size-5! mr-1" />}
            Buy Now
        </Button>
    )
}

export default Buynow
