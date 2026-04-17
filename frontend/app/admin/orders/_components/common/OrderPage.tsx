"use client";
import { Card } from '@/components/ui/card'
import { OrderTable } from '../table/OrderTable'
import { SearchInput } from '../table/SearchInput'
import { useState, useEffect } from 'react'

const OrderPage = () => {
    const [searchTerm, SetSearchTerm] = useState("");
    const [debounce, SetDebounce] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            SetDebounce(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    return (
        <div>
            <div className="heading flex items-center justify-between gap-4">
                <h1 className='text-2xl font-semibold'>Orders</h1>
            </div>
            <Card className='lg:mt-6 mt-4'>
                <div className="px-5 py-4 border-b border-border/40">
                    <SearchInput onChange={SetSearchTerm} value={searchTerm} placeholder='Search Order Number or Product...' />
                </div>
                <OrderTable searchTerm={debounce} />
            </Card>
        </div>
    )
}

export default OrderPage;
