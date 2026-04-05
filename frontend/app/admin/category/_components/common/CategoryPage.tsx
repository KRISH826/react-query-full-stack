
"use client";
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CategoryTable } from '../table/DataTable'
import { SearchInput } from '../table/SearchInput'
import AddEditCategory from './AddEditCategory'
import { useState } from 'react'
import { Category } from '@/types/category';

const CategoryPage = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const handleAdd = () => {
        setSelectedCategory(null);
        setDialogOpen(true);
    };

  return (
    <div>
        <div className="heading flex items-center justify-between gap-4">
            <h1 className='text-2xl font-semibold'>Categories</h1>
            <Button onClick={handleAdd}>Create Category</Button>
            <AddEditCategory open={dialogOpen} onOpenChange={setDialogOpen} />
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