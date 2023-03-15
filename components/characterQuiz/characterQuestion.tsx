import { useState } from 'react'
import getConfig from 'next/config'
import { Socket } from 'socket.io-client'

const { publicRuntimeConfig } = getConfig()
const { url } = publicRuntimeConfig

type Props = {
    user_id: string
    username: string
    socket: Socket
    question: {
        answer:string
        image: string
        options: Array<string>
    }
    setQuestion: any
    currentQuestion: number,
    setCurrentQuestion: any,
    setShowSection: any
    setScore: any
    setTime: any
    updateQuestion: any,
    total: number
}

const CharacterQuestion = ({
    user_id,
    username,
    socket,
    question,
    setQuestion,
    currentQuestion,
    setCurrentQuestion,
    setShowSection,
    setScore,
    setTime,
    updateQuestion,
    total
}: Props) => {
        
    const answer = question.answer
    const image = question.image
    const options = question.options

    const [disable, setDisable] = useState(false)
    const [animation, setAnimation] = useState(false)
    const [hide, setHide] = useState(false)
    const [colors, setColors] = useState(['bg-white', 'bg-white', 'bg-white', 'bg-white'])
    const [text, setText] = useState(['text-black', 'text-black', 'text-black', 'text-black'])
    const [countdown, setCountdown] = useState(100)

    /*
    useEffect(() => {
        setOptions((options) => [...shuffleArray(options)])
    }, [])
    */

    const selectChoice = (choice: string, index: number) => {
        if (choice === answer) {
            setColors((colors: Array<string>) => {
                colors[index] = 'bg-emerald-400'
                return [...colors]
            })
            setText(text => {
                text[index] = 'text-white'
                return [...text]
            })
            if (username === '') setScore((score: number) => score + 1)
        }
        else {
            let correct: number  = 0
            for (let i = 0; i < options.length; ++i) {
                if (options[i] === answer) {
                    correct = i
                    break
                }
            }
            setColors(colors => {
                colors[index] = 'bg-red-400'
                colors[correct] = 'bg-green-400'
                return [...colors]
            })
            setText(text => {
                text[index] = 'text-white'
                return [...text]
            })
        }

        setTimeout(() => {
            setColors(() => ['bg-white', 'bg-white', 'bg-white', 'bg-white'])
            setText(() => ['text-black', 'text-black', 'text-black', 'text-black'])
        }, 100)
    }

    return (
        <div className={`flex flex-col items-center
            ${animation ? 'animate-fadeOut' : 'none'}
            ${hide ? 'hidden' : 'none'}`}>
            <div className='flex justify-between w-full mb-1'>
                <span className='ml-2 '>Name this character:</span>
            </div>
            <img 
                src={`${url}/assets/${image}`} 
                alt=''
                sizes='(max-width: 768px) 100vw,
                        (max-width: 1200px) 50vw,
                        33vw'
                className='w-80 h-44 rounded object-cover mb-2'
            />
            <div className='grid grid-cols-2 gap-2 mb-4'>
            { options.map((option, index) =>
                <button key={index} disabled={disable}
                    className={`w-40 h-16 p-2 rounded font-semibold
                        border border-gray-100 shadow-sm
                        ${colors[index]} ${text[index]}`}
                    onClick={async (val) => {
                        const character = (val.target as HTMLElement).innerHTML
                        selectChoice(character, index)
                        await new Promise(r => setTimeout(r, 100))
                        if (user_id !== '' && username !== '') {
                            socket.emit('question', user_id, character,
                                (response: any) => {
                                    if (response.hasOwnProperty('answer'))
                                        setQuestion(() => { return response })
                                    else {
                                        setScore(() => response.score)
                                        setTime(() => response.time)
                                        setShowSection(2)
                                    }
                            })
                        }
                        else {
                            if (currentQuestion >= total - 1) setShowSection(2)
                            else updateQuestion()
                        }
                        setCurrentQuestion((currentQuestion: number) => currentQuestion + 1)
                    }}>
                    {option}
                </button>
            )}
            </div>
        </div>
    )
}

export default CharacterQuestion
