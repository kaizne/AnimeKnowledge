import { useRouter } from 'next/router'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import Related from '../related'

const loggedInNotify = () => toast.success('You score has been recorded successfully.')
const notLoggedInNotify = () => toast.error('Only logged in users will have their score recorded on the leaderboard!')

interface CharacterConclusion {
    username: string,
    slug: string,
    title: string,
    url: string,
    featured_image: string,
    score: number,
    total: number,
    time: string,
    related: Array<any>
}

const CharacterConclusion = ({ username, slug, title, url, featured_image, score, total, time, related }: CharacterConclusion) => {
    const router = useRouter()

    useEffect(() => {
        if (username && username !== '') { loggedInNotify() }
        else { notLoggedInNotify() }
    }, [])
    
    return (
        <div className='grid md:grid-cols-3 gap-x-8 gap-y-8 mt-4 md:mt-0'>
            <div className='w-80'></div>
            <div className='flex flex-col place-items-center'>
                <div className='w-80 md:w-96 mt-4 md:mt-0 text-center text-md md:text-lg font-semibold mb-1'>{title}</div>
                <img 
                    src={`${url}/assets/${featured_image}`} 
                    alt=''
                    sizes='(max-width: 768px) 100vw,
                            (max-width: 1200px) 50vw,
                            33vw'
                    className='w-72 h-40 rounded object-cover mb-2'
                />
                <div className='text-lg font-medium'>You got {score} out of {total}!</div>
                <div>Your score:  
                    <span className='font-medium'> { (score / total * 100).toFixed(2) }</span>%
                </div>
                <div>Your time: {time}s</div>
                <button
                    onClick={ () => router.reload() }
                    className='
                        w-80 p-2 mt-4
                        bg-indigo-600 text-white font-bold rounded'>
                    Play Again
                </button>
                <div className='mt-6 text-indigo-600 text-xl font-medium'>Enjoy this quiz?</div>
                <a
                    href={`https://facebook.com/sharer.php?u=https://www.quizultra.com/${slug}`} target='_blank'
                    className='flex flex-row justify-center gap-x-2 w-80 p-2 mt-2 
                    bg-blue-600 text-white font-medium rounded'>
                    <img src='/facebook.svg' />
                    <div>Share</div>
                </a>
                <a
                    href={`https://twitter.com/share?url=https://www.quizultra.com/${slug}&text=${title}`} target='_blank'
                    className='flex flex-row justify-center gap-x-2 w-80 p-2 mt-2 
                    bg-sky-500 text-white font-medium rounded'>
                    <img src='/twitter.svg' />
                    <div>Tweet</div>
                </a>
            </div>
            <Related quizzes={related} url={url} slug={slug} />
        </div>
    )
}

export default CharacterConclusion
