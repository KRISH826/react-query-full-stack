import ProductForm from './_components/ProductForm'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return (
    <ProductForm productId={id} />
  )
}

export default page