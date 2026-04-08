"use client"
import { SearchInput } from '@/app/admin/category/_components/table/SearchInput'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ProductTable } from '../table/ProductTable'
import { useRouter } from 'next/navigation'

const ProductPage = () => {
    const router = useRouter();

    const handleAddProduct = () => {
        router.push('/admin/product/new')
    }
  return (
    <div>
            <div className="heading flex items-center justify-between gap-4">
                <h1 className='text-2xl font-semibold'>Products</h1>
                <Button onClick={handleAddProduct}>Create Product</Button>
            </div>
            <Card className='lg:mt-6 mt-4'>
                <div className="px-5">
                    <SearchInput />
                </div>
                <ProductTable />
            </Card>
    
        </div>
  )
}

export default ProductPage