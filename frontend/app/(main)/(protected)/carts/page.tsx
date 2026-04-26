import RequireAuth from "@/components/auth/RequireAuth";
import CartPage from "./_components/CartPage";

const page = () => {
    return (
        <RequireAuth>
            <CartPage />
        </RequireAuth>
    )
}

export default page
