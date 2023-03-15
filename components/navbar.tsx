import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useUser } from '@supabase/auth-helpers-react'
import supabase from '../utils/supabase-browser'
import { getPublicDirectusClient } from '../lib/directus'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
const { url } = publicRuntimeConfig

const logOutNotify = () => toast.success('You have logged out.')

interface Navbar {
    setOverlay: any
}

const Navbar = ({ setOverlay }: Navbar) => {
    const router = useRouter()
    const user = useUser()

    const [quizzes, setQuizzes] = useState<any>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [mobileSearch, setMobileSearch] = useState(false)

    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {              
                setLoggedIn(true)
            }
            if (event === 'SIGNED_OUT') {
                setLoggedIn(false)
            }
        })

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])

    useEffect(() => {
        if (user) setLoggedIn(true)
        else setLoggedIn(false)
    }, [user])

    useEffect(() => {
        setSearchTerm('')
    }, [router.query])

    useEffect(() => {
        ;(async () => {
            const directus = await getPublicDirectusClient()
            const quizzes = await directus.items('quizzes').readByQuery({ limit: -1 })
            setQuizzes(() => quizzes.data)
        })()
    }, [])

    return (
        <div className='grid place-items-center z-40 top-0 h-14 border-b shadow-sm'>
            <div className={`${!mobileSearch ? 'flex w-96' : 'hidden'} flex md:w-screen justify-between`}>
                <div className='flex flex-row gap-x-2 md:gap-x-4 ml-2 md:ml-0'>
                    <div className='self-center md:ml-4'>
                        <Link href='/' className='font-bold text-lg md:text-xl'>
                            AnimeKnowledge
                        </Link>
                    </div>
                    <Link href='/browse'
                        className='font-semibold text-md md:text-lg self-center'>
                        Browse
                    </Link>
                </div>
                <div className='md:hidden grid content-center font-bold'>
                    <img src='/search.svg' className='w-6' onClick={ () => setMobileSearch(() => true) } />
                </div>
                <div className='content-center hidden md:grid w-96 bg-gray-150 rounded-lg'>
                    <input className='w-full h-9 pl-2 bg-gray-100 rounded' type='text' placeholder='Search for a quiz'
                            value={searchTerm} onChange={ (event) => { 
                                setSearchTerm(() => event.target.value)
                            }}
                            onBlur={() => setTimeout(() => setSearchTerm(''), 100)}
                    />
                    <div className={`${searchTerm !== '' ? 
                        'flex flex-col gap-y-2 w-96 mt-2 pt-2 pl-2 pb-2 absolute top-10 shadow bg-white' 
                        : 'hidden'}`}>
                        {   quizzes.filter((element: any) => {
                                return element.title.toLowerCase().includes(searchTerm.toLowerCase())
                            })
                            .sort()
                            .slice(0, 10)
                            .map((element: any, index: number) => {
                                return (
                                    <a key={index} className='flex flex-row items-center hover:bg-gray-100' href={element.slug}>
                                        <img src={`${url}/assets/${element.featured_image}`}
                                            className='relative w-16 h-10 rounded object-cover' />
                                        <div className='ml-2 text-sm'>
                                            { element.title.split(' ').map((element: string, index: number) => {
                                                if (searchTerm.toLowerCase().includes(element.toLowerCase())) {
                                                    return <span key={index} className='font-semibold'>{element} </span>
                                                } else {
                                                    return <span key={index}>{element} </span>
                                                }
                                            })}

                                        </div>
                                    </a>
                                    
                                )
                            })
                        }
                    </div>
                </div>
                <div className='flex flex-row items-center gap-x-2 md:gap-x-4 mr-4 md:mr-0'>
                    <a href='https://discord.gg/WSWcCHgWCX' target='_blank'>
                        <img src='/discord-blue.svg' className='content-center w-8 md:w-10' />
                    </a>
                    { !loggedIn && 
                        <button
                            onClick={() => setOverlay('logIn')}
                            className='
                                h-8 md:mr-8 pt-1 pb-1 pr-2 pl-2 rounded font-semibold
                                bg-indigo-600 md:hover:bg-indigo-400 text-white'>
                            Log In
                        </button>
                    }
                    { loggedIn &&
                        <button
                            onClick={async () => {
                                const { error } = await supabase.auth.signOut()
                                logOutNotify()
                            }}
                            className='
                                h-8 md:mr-8 pt-1 pb-1 pr-2 pl-2 rounded font-semibold
                                bg-indigo-600 hover:bg-indigo-400 text-white'>
                            Log Out
                        </button>
                    }
                    <Toaster />
                </div>
            </div>
            <div className={`${mobileSearch ? 'flex flex-row w-96' : 'hidden'}`}>
                <ChevronLeftIcon className='w-7 ml-2 mr-2' onClick={ () => setMobileSearch(() => false) }/>
                <div className='grid content-center w-80 bg-gray-150 rounded-lg'>
                        <input className='w-full h-9 pl-2 bg-gray-100 rounded text-lg' 
                            type='text' placeholder='Search for a quiz'
                                value={searchTerm} onChange={ (event) => { 
                                    setSearchTerm(() => event.target.value)
                                }}
                                onBlur={() => {
                                    setTimeout(() =>  {
                                        setSearchTerm('')
                                        setMobileSearch(() => false)
                                    }, 100)
                                }}
                        />
                        <div className={`${searchTerm !== '' ? 
                            'flex flex-col gap-y-2 w-80 mt-2 pt-2 pl-2 pb-2 absolute top-10 shadow bg-white' 
                            : 'hidden'}`}>
                            {   quizzes.filter((element: any) => {
                                    return element.title.toLowerCase().includes(searchTerm.toLowerCase())
                                })
                                .sort()
                                .slice(0, 6)
                                .map((element: any, index: number) => {
                                    return (
                                        <a key={index} className='flex flex-row items-center w-80' 
                                            href={element.slug}>
                                            <img src={`${url}/assets/${element.featured_image}`}
                                                className='relative w-16 h-10 rounded object-cover' />
                                            <div className='ml-2 text-sm'>
                                                { element.title.split(' ').map((element: string, index: number) => {
                                                    if (searchTerm.toLowerCase().includes(element.toLowerCase())) {
                                                        return <span key={index} className='font-semibold'>{element} </span>
                                                    } else {
                                                        return <span key={index}>{element} </span>
                                                    }
                                                })}
                                            </div>
                                        </a>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default Navbar
