import { useEffect, useState } from 'react'
import getConfig from 'next/config'
import Head from 'next/head'
import { Quiz } from '../../interfaces'
import { findCharacterImage } from '../../lib/quiz'
import PersonalityQuestion from './personalityQuestion'
import PersonalityIntro from './personalityIntro'
import PersonalityConclusion from './personalityConclusion'
import Unreleased from '../unreleased'

const { publicRuntimeConfig } = getConfig()
const { url } = publicRuntimeConfig 

type Props = {
    quiz: Quiz
    related: Array<any>
}

const shuffleArray = (array: Array<object>) => {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let temp = array[i]
        array[i] = array[j]
        array[j] = temp
    }
    return array
}

const PersonalityQuiz = ({ quiz, related }: Props) => {

    // Quiz Properties
    const slug = quiz.slug
    const meta_title = quiz.meta_title
    const meta_description = quiz.meta_description
    const title = quiz.title
    const featured_image = quiz.featured_image
    const description = quiz.description
    const characters = quiz.characters
    const media = quiz.media
    const total = quiz.questions?.length
    const requests = quiz.requests || 0
    const plays = quiz.plays || 0
    const date_created = quiz.date_created
    const date_updated = quiz.date_updated
    const [date, setDate] = useState('')
    const [questions, setQuestions] = useState(quiz.questions)

    // Sections
    // Intro: 0, Quiz: 1, Conclusion: 2
    const [showSection, setShowSection] = useState(0)

    // Quiz Logic
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [tally, setTally] = useState<any>([])
    const [character, setCharacter] = useState<string>('')
    const [characterImage, setCharacterImage] = useState<string>('')

    const [done, setDone] = useState<boolean>(false)
    
    useEffect(() => {
        let arr: number[] = []
        if (characters && questions) {
            for (let i = 0; i < Object.keys(characters).length; ++i) arr.push(0)
            setTally(() => arr)
            setQuestions((questions) => [...shuffleArray(questions)])
            setDone(() => true)
        }

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
        if (showSection === 2) {
            let max = 0
            let elem = -1
            for (let i = 0; i < tally.length; ++i) {
                if (tally[i] > max) {
                    max = tally[i]
                    elem = i
                }
            }
            setCharacter(() => Object.values(characters)[elem])
            setCharacterImage(() => findCharacterImage(media, Object.values(characters)[elem]))
        }
    }, [showSection])

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
                <PersonalityIntro
                    done={done}
                    slug={slug}
                    title={title} 
                    url={url} 
                    featured_image={featured_image} 
                    date={date} 
                    plays={plays}
                    setShowSection={setShowSection}
                    description={description}
                    related={related}
                />
            }
            { showSection === 1 && !questions &&
                <Unreleased 
                    slug={slug} 
                    title={title} 
                    requests={requests}
                    related={related}
                    url={url}
                />
            }
            { /* Quiz */ }
            { showSection === 1 && questions &&
                questions.map((question: any, index) =>
                    <PersonalityQuestion 
                        key={index}
                        url={url}
                        index={index}
                        total={total}
                        question={question}
                        currentQuestion={currentQuestion}
                        setCurrentQuestion={setCurrentQuestion}
                        setShowSection={setShowSection}
                        tally={tally}
                        setTally={setTally}
                    />
                )
            }
            { /* Conclusion */ }
            { showSection === 2 && 
                <div>
                    <PersonalityConclusion
                        url={url}
                        character={character}
                        characterImage={characterImage}
                    />
                </div>
            }
        </div>
    )
}

export default PersonalityQuiz
