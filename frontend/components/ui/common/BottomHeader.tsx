"use client"

import { useGetAllCategoriesQuery } from '@/services/categoryApi'
import Link from 'next/link'
import React from 'react'
const BottomHeader = () => {
    const { data: categories } = useGetAllCategoriesQuery()
    return (
        <div className='py-3 bg-secondary/30 backdrop-blur-md border-t shadow-sm border-secondary'>
            <div className="container">
                <div className='flex items-center gap-5'>
                    <ul className='flex items-center gap-4 md:gap-5 overflow-x-auto whitespace-nowrap scrollbar-hide flex-nowrap pb-1 md:pb-0'>
                        {
                            categories?.map((category) => (
                                <li key={category.id}>
                                    <Link href={`/categories/category?slug=${category.slug}&id=${category.id}`} className='text-[10px] md:text-base py-1 w-fit hover:border-b border-primary text-primary/80 font-medium hover:text-primary transition-colors'>
                                        {category.name}
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default BottomHeader