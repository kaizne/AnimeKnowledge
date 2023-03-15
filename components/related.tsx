import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

interface Related {
    quizzes: Array<any>
    url: string
    slug: string
}

const Related = ({ quizzes, url, slug } : Related) => {

    const router = useRouter()
    const [relatedQuizzes, setRelatedQuizzes] = useState<any>([])

    useEffect(() => {
        setRelatedQuizzes(() => {
            return quizzes
                .filter(value => value.slug !== slug)
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value)
                .slice(0, 3)
        })
    }, [router.query])

    return (
        <div className='md:w-64 '>
            <div className='mb-2 font-semibold rounded underline'>Related Quizzes</div>
            <div className='flex flex-col gap-y-2'>
            { relatedQuizzes.map((quiz: any, index: number) => {
                return (
                    <a key={index} href={quiz.slug}
                        className='mb-2 md:mb-0 hover:bg-gray-200'>
                        <div className='relative w-80 h-44 md:w-64 md:h-32'>
                            <img
                                src={`${url}/assets/${quiz.featured_image}`} 
                                alt=''
                                className='w-80 h-44 md:w-64 md:h-32 rounded object-cover mb-2'
                            />
                        </div>
                        <div className='w-80 md:w-64 h-8 md:h-10 pt-0.5 text-sm font-medium'>{quiz.title}</div>
                    </a>
                )
            })}
            </div>
        </div>      
    )
}

export default Related
