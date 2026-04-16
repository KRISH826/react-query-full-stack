"use client";

import { useRouter } from "next/navigation";
import { Button } from "../../button";
import { Heart } from "lucide-react";
import { useGetProfileQuery } from "@/services/userApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Favourites = () => {
    const router = useRouter();
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const { data: user, isLoading } = useGetProfileQuery(undefined, {
        skip: !token,
        refetchOnMountOrArgChange: true,
    });

    const navigateFavourites = () => {
        if (!user) {
            router.push("/login");
            return;
        }

        router.push("/favourites");
    };
    return (
        <Button
            variant="ghost"
            onClick={navigateFavourites}
            className="relative hidden sm:inline-flex items-center gap-1.5 px-3 h-9 cursor-pointer"
            disabled={isLoading}
        >
            <Heart className="h-4 w-4" />
            <span className="text-xs font-medium">Wishlist</span>
        </Button>
    );
};

export default Favourites;
