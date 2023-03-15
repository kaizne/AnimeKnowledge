import Image from 'next/image'
import { useState } from 'react'
import { NextPage } from 'next'

type Props = {
    url: string
    index: number
    total: number
    question: {
        title:string
        media: string
        options: object
        multiple: boolean
        limit: number
    }
    currentQuestion: number
    setCurrentQuestion: any
    setShowSection: any
    tally: number[],
    setTally: any
}

const PersonalityQuestion: NextPage<Props> = ({
    url,
    index, 
    total, 
    currentQuestion, 
    setCurrentQuestion, 
    question, 
    setShowSection,
    tally,
    setTally }) => {

    const title = question.title
    const media = question.media
    const multiple = question.multiple
    const limit = question.limit
    
    const [options, setOptions] = useState(question.options)
    const [animation, setAnimation] = useState(false)
    const [hide, setHide] = useState(false)

    const [selected, setSelected] = useState<Number[]>([])

    return (
        <div className={`flex flex-col items-center
            ${currentQuestion >= index ? 'none' : 'hidden'}
            ${currentQuestion === index ? 'animate-fadeIn' : 'none'}
            ${animation ? 'animate-fadeOut' : 'none'}
            ${hide ? 'hidden' : 'none'}`}>
            <div className='text-lg mb-1 text-center'>{title}</div>
            <div className='relative w-80 h-44 mb-2'>
                <Image 
                    src={`${url}/assets/${media}`}
                    alt=''
                    fill={true}
                    priority={true}
                    sizes='(max-width: 768px) 100vw,
                            (max-width: 1200px) 50vw,
                            33vw'
                    className='rounded object-cover' 
                />
            </div>
            <div className='text-sm mb-2 text-gray-500'>{limit && `(select up to ${limit})`}</div>
            {Object.keys(options).length >= 6 ?
                <div className='grid grid-cols-2 gap-1 mb-2'>
                    {Object.keys(options).map((option, index) => {
                        return (
                            <button key={index}
                                    onClick={() => {
                                        multiple
                                            ? selected.includes(index)
                                                ? setSelected((selected) => selected.filter(item => item !== index))
                                                : selected.length < limit && setSelected((selected) => [...selected, index])
                                            : setSelected(() => [index])
                                    }}
                                    className={`w-40 h-12 rounded text-center font-semibold border
                                        ${selected.includes(index)
                                            ? 'bg-red-300 text-white'
                                            : 'bg-white text-red-300'}`}>
                                {option}
                            </button>
                        )
                    })}
                </div>
                : <div className='grid grid-cols-1 mb-2'>
                    {Object.keys(options).map((option, index) => {
                        return (
                            <button key={index}
                                    onClick={() => { 
                                        multiple 
                                            ? selected.includes(index)
                                                ? setSelected((selected) => selected.filter(item => item !== index))
                                                : selected.length < limit && setSelected((selected) => [...selected, index])
                                            : setSelected(() => [index])
                                    }}
                                    className={`w-80 h-12 p-2 mb-1 rounded text-center font-semibold border
                                        ${selected.includes(index)
                                            ? 'bg-red-300 text-white'
                                            : 'bg-white text-red-300'}`}>
                                {option}
                            </button>
                        )
                    })}
                </div>
            }
            <button
                onClick={() => {
                    for (let select of selected) {
                        const characters = Object.values(options)[select as number]
                        for (let character of characters) tally[character]++
                    }
                    setTally(() => tally)
                    setTimeout(() => {
                        setAnimation(false)
                        setHide(true)
                        if ((currentQuestion + 1) === total) setShowSection(2)
                        else setCurrentQuestion((currentQuestion: number) => currentQuestion + 1)
                    }, 900)}}
                disabled={selected.length === 0 ? true : false}
                className={`w-80 p-2 mb-3 rounded font-bold border
                    ${selected.length === 0
                        ? 'bg-gray-300 text-white'
                        : 'bg-red-500 text-white'}`}>
                Next
            </button>
        </div>
    )
}

export default PersonalityQuestion
