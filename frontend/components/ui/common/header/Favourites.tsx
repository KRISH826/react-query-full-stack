"use client";

import { useRouter } from "next/navigation";
import { Button } from "../../button";
import { Heart } from "lucide-react";
import { useGetProfileQuery } from "@/services/userApi";
import { Spinner } from "../../spinner";
import { useGetFavouritesQuery } from "@/services/favouriteApi";

const Favourites = () => {
    const router = useRouter();
    const { data: user, isLoading } = useGetProfileQuery();

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
            size="icon"
            className="relative"
            disabled={isLoading}
        >
            <Heart className="h-5 w-5" />
        </Button>
    );
};

export default Favourites;
