import React from 'react'
import { Button } from '../../button'
import { Heart } from 'lucide-react'

const Favourites = () => {
    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex relative"
            >
                <Heart className="h-5 w-5" />
            </Button>
        </>
    )
}

export default Favourites