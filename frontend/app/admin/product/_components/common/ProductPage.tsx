"use client"
import { SearchInput } from '@/app/admin/category/_components/table/SearchInput'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ProductTable } from '../table/ProductTable'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const ProductPage = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [debounce, setDebounce] = useState("");

    const handleAddProduct = () => {
        router.push('/admin/product/new')
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounce(searchTerm);
        }, 500);

        return () => {
            clearTimeout(timer);
        }
    }, [searchTerm])

    return (
        <div>
            <div className="heading flex items-center justify-between gap-4">
                <h1 className='text-2xl font-semibold'>Products</h1>
                <Button onClick={handleAddProduct}>Create Product</Button>
            </div>
            <Card className='lg:mt-6 mt-4'>
                <div className="px-5">
                    <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder='Search By Name or Brand...' />
                </div>
                <ProductTable searchTerm={debounce} />
            </Card>

        </div>
    )
}

export default ProductPage