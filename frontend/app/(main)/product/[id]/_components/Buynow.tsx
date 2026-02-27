import { ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'

const Buynow = () => {
    const router = useRouter()
    return (
        <>
            <button onClick={() => router.push("/checkout")} className="flex items-center gap-2 justify-center rounded-lg bg-secondary border-secondary border-solid transition-all cursor-pointer duration-300 ease-in-out flex-1 border px-6 py-2 text-sm font-medium">
                <ShoppingBag className="size-5! mr-1" />  Buy Now
            </button>
        </>
    )
}

export default Buynow