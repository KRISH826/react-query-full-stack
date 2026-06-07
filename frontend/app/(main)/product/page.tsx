
import { Metadata } from 'next';
import ProductPage from './_components/ProductPage'

export const metadata: Metadata = {
    title: "All Products — DropCulture",
    description: "Browse all premium fashion products at DropCulture.",
};

const page = () => {
    return (
        <ProductPage />
    )
}

export default page