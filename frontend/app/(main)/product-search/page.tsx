import React, { Suspense } from 'react'
import ProductSearchPage from './_components/ProductSearchPage'

const page = () => {
    return (
        <Suspense fallback={<div>Loading search results...</div>}>
            <ProductSearchPage />
        </Suspense>
    )
}

export default page