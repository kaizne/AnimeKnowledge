import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import { incrementPlays } from '../../lib/supabase/supabase'
import supabase from '../../utils/supabase-browser'
import Leaderboard from '../leaderboard'
import { useUser } from '@supabase/auth-helpers-react'
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
    socket: Socket,
    setQuestion: any,
    user_id: string,
    username: string,
    leaderboard: Array<object>
    total: number
    related: Array<any>
}

type Run = {
    score: number,
    time: number
}

const CharacterIntro = ({ 
    done,
    slug,
    title,
    url,
    featured_image,
    date,
    plays,
    setShowSection,
    description,
    socket,
    setQuestion,
    user_id,
    username,
    leaderboard,
    total,
    related
}: Props) => {

    const user = useUser()
    const [typeZero, setTypeZero] = useState<Run>()

    useEffect(() => {
        if (user) {
            ;(async () => {
                const { data, error } = await supabase
                    .from('profiles')
                    .select()
                    .eq('id', user.id)

                if (data) { setTypeZero(() => data[0]['type_zero'][slug.replaceAll('-', '_')]) }
            })()
        }
    }, [user])

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {         
                if (session) {
                    ;(async () => {
                        const { data, error } = await supabase
                            .from('profiles')
                            .select()
                            .eq('id', session.user.id)
        
                        if (data) { setTypeZero(() => data[0]['type_zero'][slug.replaceAll('-', '_')]) }
                    })()
                } 
            }
            if (event === 'SIGNED_OUT') { setTypeZero(undefined) }
        })
        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])

    return (
        <div className='grid md:grid-cols-3 gap-x-8 gap-y-2 mt-4 md:mt-0'>
            <div className='hidden md:block'>
                <Leaderboard leaderboard={leaderboard} total={total} />
            </div>
            <div className='flex-col text-center w-80'>
                <div className='grid place-content-center h-14 mb-3 bg-indigo-300 rounded'>
                    <h1 className='font-bold text-base'>{title}</h1>
                </div>
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
                        if (done && user_id !== '' && username !== '') {
                            socket.emit('start', user_id, slug, (response: any) => {
                                setQuestion(() => response)
                                setShowSection(1)
                            })
                        }
                        else {
                            setShowSection(1)
                        }
                    }}>Play</button>
                <div className='grid place-content-center h-14 mb-1 md:mb-2 bg-gray-100 text-base'>
                    { typeZero ? 
                    <div>
                    <div className='text-sm'>Your best run</div>
                    <div>
                        <span className='font-semibold text-indigo-600'>Score:</span> 
                        &nbsp;
                        <span className='font-medium'>{ (typeZero.score / total * 100).toFixed(2) }%</span>
                        &nbsp;&nbsp;
                        <span className='font-semibold text-indigo-600'>Time</span>
                        &nbsp;
                        <span className='font-medium'>{typeZero.time}s</span>
                    </div>
                    </div> : 
                    <div className='font-medium text-indigo-600'>Log in to save your score</div>
                    }
                </div>
                <div className='hidden md:flex md:flex-col bg-gray-100 p-2 rounded w-80 md:h-36 text-sm'>
                    <h2 className='text-left font-semibold border-b-2'>Quiz Description</h2>
                    <div className='text-justify'>{description}</div>
                </div>
            </div>
            <div className='md:hidden'>
                <Leaderboard leaderboard={leaderboard} total={total} />
            </div>
            <div className='flex flex-col mt-1 md:hidden bg-gray-100 p-2 rounded w-80 md:h-36 text-sm'>
                <h2 className='text-left font-semibold border-b-2'>Quiz Description</h2>
                <div className='text-justify'>{description}</div>
            </div>
            <Related quizzes={related} url={url} slug={slug} />
        </div>
    )
}

export default CharacterIntro
