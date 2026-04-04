import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CategoryTable } from '../table/DataTable'
import { SearchInput } from '../table/SearchInput'

const CategoryPage = () => {
  return (
    <div>
        <div className="heading flex items-center justify-between gap-4">
            <h1 className='text-2xl font-semibold'>Categories</h1>
            <Button>Create Category</Button>
        </div>
        <Card className='lg:mt-6 mt-4'>
            <div className="px-5">
                <SearchInput />
            </div>
            <CategoryTable />
        </Card>

    </div>
  )
}

export default CategoryPage