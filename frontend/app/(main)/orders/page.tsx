import OrderPage from "./_components/OrderPage"

const page = () => {
    return (
        <div className="order_page py-8">
            <div className="container">
                <div className="mb-6">
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Your Orders
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Your Orders History
                    </p>
                </div>
                <OrderPage />
            </div>
        </div>
    )
}

export default page