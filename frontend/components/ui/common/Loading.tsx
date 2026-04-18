import { Spinner } from '../spinner'

const Loading = () => {
    return (
        <div className='h-72 flex justify-center items-center'>
            <Spinner className='size-12' />
        </div>
    )
}

export default Loading