import { useState } from 'react'
import { incrementRequests } from '../lib/supabase/supabase'
import Related from './related'

type Props = {
    slug: string
    title: string
    requests: number
    related: Array<any>
    url: string
}

const Unreleased = ({ slug, title, requests, related, url }: Props) => {
    const [count, setCount] = useState(requests)
    const [disable, setDisable] = useState(false)
    return (
        <div className='mt-4 md:mt-0'>
            <div className='font-semibold text-lg mb-1'>{title}</div>
            <div className='mb-4 bg-indigo-500 text-white font-semibold p-1 rounded'>This quiz is not available yet.</div>
            <div className='flex flex-row mb-4'>
                <div className='flex flex-col border-2 rounded-lg border-indigo-500'>
                    <button className='grid place-content-center w-16 p-1 rounded-t active:bg-gray-300 hover:cursor-pointer'
                        onClick={() => {
                            setCount((count) => count + 1)
                            incrementRequests(slug)
                            setDisable(() => true)
                        }}
                        disabled={disable}>
                        <img src='up.svg'/>
                    </button>
                    <div className='w-16 text-center font-semibold border-t-2 border-indigo-500 p-1'>{count}</div>
                </div>
                <div className='mt-5 ml-5 font-semibold'>Request this quiz</div>
            </div>
            <Related quizzes={related} url={url} slug={slug} />
        </div>
    )
}

export default Unreleased
