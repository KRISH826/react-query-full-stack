import { BsFillStarFill, BsStarHalf, BsStar } from "react-icons/bs";

type Props = {
    rating?: number;
    reviewCount?: number;
    size?: number;
    fontSizeClass?: string
};

const STAR_COLOR = "#FF9900";

// ⭐ Utility (production-friendly)
function getStars(rating: number) {
    const stars = [];
    const clamped = Math.max(0, Math.min(5, rating));

    for (let i = 1; i <= 5; i++) {
        if (clamped >= i) {
            stars.push("full");
        } else if (clamped >= i - 0.5) {
            stars.push("half");
        } else {
            stars.push("empty");
        }
    }

    return stars;
}

const ProductRating = ({
    rating = 0,
    reviewCount = 0,
    size = 14,
    fontSizeClass = "text-xs"
}: Props) => {
    const stars = getStars(rating);

    return (
        <>
            {
                rating !== 0 && (
                    <>
                        <div className="flex items-center gap-1.5 my-1">

                            {/* ⭐ Stars */}
                            {
                                rating > 0 && (
                                    <>
                                        <div className="flex items-center gap-0.5">
                                            {stars.map((type, i) => {
                                                if (type === "full") {
                                                    return <BsFillStarFill key={i} size={size} color={STAR_COLOR} />;
                                                }
                                                if (type === "half") {
                                                    return <BsStarHalf key={i} size={size} color={STAR_COLOR} />;
                                                }
                                                return <BsStar key={i} size={size} color={STAR_COLOR} />;
                                            })}
                                        </div>
                                    </>
                                )
                            }

                            {/* ⭐ Rating */}
                            {rating > 0 && (
                                <span className={`${fontSizeClass} font-bold`} style={{ color: STAR_COLOR }}>
                                    {rating.toFixed(1)}
                                </span>
                            )}

                            {/* ⭐ Review Count */}
                            {reviewCount > 0 && (
                                <span className={`${fontSizeClass} text-gray-400`}>
                                    ({reviewCount.toLocaleString()})
                                </span>
                            )}
                        </div>
                    </>
                )
            }
        </>

    );
};

export default ProductRating;