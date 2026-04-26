import RequireAuth from "@/components/auth/RequireAuth";

const page = () => {
    return (
        <RequireAuth>
            <div>Order Details</div>
        </RequireAuth>
    )
}

export default page
