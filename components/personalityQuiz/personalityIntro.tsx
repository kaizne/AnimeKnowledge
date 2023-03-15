import Image from 'next/image'
import { incrementPlays } from '../../lib/supabase/supabase'
import Related from '../related'

type Props = {
    done: boolean,
    slug: string,
    title: string,
    url: string,
    featured_image: string,
    date: string,
    plays: number,
    description: string,
    setShowSection: any,
    related: Array<any>
}

const PersonalityIntro = ({
    done,
    slug,
    title,
    url,
    featured_image,
    date,
    plays,
    setShowSection,
    description,
    related
    }: Props) => {
    return (
        <div className='grid md:grid-cols-3 gap-x-8 gap-y-2 mt-4 md:mt-0'>
            <div className='w-80'></div>
            <div className='flex-col items-center text-center w-80 mt-4 md:mt-0'>
                <h1 className='font-bold mb-3 bg-indigo-300 p-2 rounded text-base'>{title}</h1>
                <div className='relative w-80 h-44'>
                    <Image 
                        src={`${url}/assets/${featured_image}`} 
                        alt=''
                        fill={true}
                        priority={true}
                        sizes='(max-width: 768px) 100vw,
                                (max-width: 1200px) 50vw,
                                33vw'
                        className='rounded-t object-cover' 
                    />
                </div>
                <div className='flex flex-row justify-between mb-3 p-2 rounded-b bg-gray-100 text-sm'>
                    <div className='text-gray-500 text-sm'>Updated: {date}</div>
                    <div className='text-sm'><span className='font-medium'>{plays}</span> plays</div>
                </div>
                <button className='w-80 rounded p-2 mb-3 text-white bg-indigo-600 font-bold'
                    onClick={() => {
                        if (done) incrementPlays(slug)
                        setShowSection(1)
                    }}>Play</button>
                <div className='flex-col bg-gray-100 p-2 rounded w-80 md:h-52 text-sm'>
                    <h2 className='text-left font-semibold border-b-2'>Quiz Description</h2>
                    <div className='text-justify'>{description}</div>
                </div>
            </div>
            <Related quizzes={related} url={url} slug={slug} />
        </div>
    )
}

export default PersonalityIntro
