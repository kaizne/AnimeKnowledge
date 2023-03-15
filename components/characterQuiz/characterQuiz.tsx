import { useEffect, useState } from 'react'
import getConfig from 'next/config'
import Head from 'next/head'
import { useUser } from '@supabase/auth-helpers-react'
import CharacterQuestion from './characterQuestion'
import { CharacterQuiz } from '../../interfaces'
import CharacterIntro from './characterIntro'
import Unreleased from '../unreleased'
import socket from '../../lib/socket.io/socket'
import CharacterConclusion from './characterConclusion'
import supabase from '../../utils/supabase-browser'

const { publicRuntimeConfig } = getConfig()
const { url } = publicRuntimeConfig

type Props = {
    quiz: CharacterQuiz
    related: Array<any>
}

const CharacterQuiz = ({ quiz, related }: Props) => {

    // Quiz Properties
    const uuid = quiz.uuid
    const slug = quiz.slug
    const meta_title = quiz.meta_title
    const meta_description = quiz.meta_description
    const title = quiz.title
    const featured_image = quiz.featured_image
    const description = quiz.description
    const characters: any = quiz.characters
    const media = quiz.media
    const plays = quiz.plays || 0
    const date_created = quiz.date_created
    const date_updated = quiz.date_updated
    const leaderboard = quiz.leaderboard

    const total = characters?.characters.length || 0

    const [date, setDate] = useState('')

    // Sections
    // Intro: 0, Quiz: 1, Conclusion: 2
    const [showSection, setShowSection] = useState(0)

    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [score, setScore] = useState(0)

    const [questions, setQuestions] = useState<any>(quiz.questions)

    const [done, setDone] = useState<boolean>(false)

    // Timer
    const [time, setTime] = useState('')

    useEffect(() => {
        if (characters) setDone(true)
        if (date_updated) {
            const date = new Date(date_updated)
            const dateStr = date.toLocaleString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})
            setDate(() => dateStr)
        }
        else {
            const date = new Date(date_created)
            const dateStr = date.toLocaleString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})
            setDate(() => dateStr)
        }
    }, [])

    useEffect(() => {
        if (leaderboard)
            leaderboard.sort((a: any, b: any) => {
                return b.score - a.score || a.time - b.time
            })
    }, [])

    const [question, setQuestion] = useState<any>()

    const user = useUser()

    const [username, setUsername] = useState('')
    const [id, setId] = useState('')

    useEffect(() => {
        if (done && user && user.user_metadata.username && showSection !== 2) {
            
            const _id = user.id
            setId(() => _id)

            const _username = user.user_metadata.username
            setUsername(() => _username)
            
            socket.auth = { user_id: _id, username : _username }
            socket.io.opts.query = { uuid: uuid }

            socket.on('time', (time) => {
                setTime(() => time)
            })

            setTimeout(() => {
                socket.connect()
            }, 50)

            // Remove in production
            /*
            socket.onAny((event, ...args) => {
                console.log(event, args)
            })
            */
        }
        else {
            let shuffledQuestions: any = []
            for (let question of shuffleArray(questions)) {
                const options = shuffleArray(question['options'])
                question.options = options
                shuffledQuestions.push(question)
            }
            setQuestions(() => shuffleArray(shuffledQuestions))
            setQuestion(() => {
                if (questions.length > 0) {
                    const nextQuestion = shuffledQuestions[0]
                    return nextQuestion
                }   
            })
        }
    }, [user])

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {         
                if (session) {
                    const _id = session.user.id
                    setId(() => _id)

                    const _username = session.user.user_metadata.username
                    setUsername(() => _username)
                    
                    socket.auth = { user_id: _id, username : _username }
                    socket.io.opts.query = { uuid: uuid }

                    socket.on('time', (time) => {
                        setTime(() => time)
                    })

                    setTimeout(() => {
                        socket.connect()
                    }, 50)
                }
            }

            if (event === 'SIGNED_OUT') { 
                socket.disconnect()
                let shuffledQuestions: any = []
                for (let question of shuffleArray(questions)) {
                    const options = shuffleArray(question['options'])
                    question.options = options
                    shuffledQuestions.push(question)
                }
                setQuestions(() => shuffleArray(shuffledQuestions))
                setQuestion(() => {
                    if (questions.length > 0) {
                        const nextQuestion = shuffledQuestions[0]
                        return nextQuestion
                    }   
                })
                setUsername(() => '')
            }
        })

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])

    const shuffleArray = (array: Array<any>) => {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            let temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
        return array
    }

    const updateQuestion = () => {
        const nextQuestion = questions[currentQuestion + 1]
        setQuestion(() => nextQuestion)
    }

    const [timer, setTimer] = useState<any>()

    useEffect(() => {
        if (showSection === 1 && username === '') startTimer()
        if (showSection === 2 && username === '') clearInterval(timer)
    }, [showSection])

    const startTimer = () => {
        let time = 0
        const timer = setInterval(() => {
            time += 0.01
            time.toFixed(2)
            setTime(() => time.toFixed(2))
        }, 10)
        setTimer(() => timer)
    }

    return (
        <div className='grid justify-items-center md:place-items-center h-screen w-screen'>
            <Head>
                <title>{meta_title}</title>
                <meta
                    name='description'
                    content={meta_description}
                    key='desc'
                />
            </Head>
            { /* Intro */ }
            { showSection === 0 &&
                <CharacterIntro
                    done={done}
                    slug={slug}
                    title={title}
                    url={url}
                    featured_image={featured_image}
                    date={date}
                    plays={plays}
                    description={description}
                    setShowSection={setShowSection}
                    socket={socket}
                    setQuestion={setQuestion}
                    user_id={id}
                    username={username}
                    leaderboard={leaderboard}
                    total={total}
                    related={related}
                />
            }
            { showSection === 1 && !characters &&
                <Unreleased 
                    slug={slug} 
                    title={title} 
                    requests={0} 
                    related={related}
                    url={url}
                />
            }
            { /* Quiz */ }
            { showSection === 1 && characters &&
                <div className='mt-8 md:mt-0'>
                    <div className='flex flex-row justify-between'>
                        <div>{time}</div>
                        <div>{currentQuestion + 1} of {total}</div>
                    </div>
                    <CharacterQuestion
                        user_id={id}
                        username={username}
                        socket={socket}
                        question={question}
                        setQuestion={setQuestion}
                        currentQuestion={currentQuestion}
                        setCurrentQuestion={setCurrentQuestion}
                        setShowSection={setShowSection}
                        setScore={setScore}
                        setTime={setTime}
                        updateQuestion={updateQuestion}
                        total={total}
                    />
                </div>
            }
            { /* Conclusion */ }
            { showSection === 2 && 
                <CharacterConclusion
                    username={username}
                    slug={slug}
                    title={title}
                    url={url}
                    featured_image={featured_image}
                    score={score} 
                    total={total} 
                    time={time}
                    related={related}
                />
            }
        </div>
    )
}

export default CharacterQuiz
