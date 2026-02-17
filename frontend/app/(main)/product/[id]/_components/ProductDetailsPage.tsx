"use client"
import { useParams } from 'next/navigation'


const ProductDetailsPage = () => {
    const params = useParams();
    const productName = params.productName as string;
    const id = params.id as string;
    return (
        <div>ProductDetailsPage - {id} - {productName}</div>
    )
}

export default ProductDetailsPage