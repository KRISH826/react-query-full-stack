import React, { Suspense } from 'react'
import ProductSearchPage from './_components/ProductSearchPage'
import Loading from '@/components/ui/common/Loading'

const page = () => {
    return (
        <Suspense fallback={<Loading />}>
            <ProductSearchPage />
        </Suspense>
    )
}

export default page