import getConfig from 'next/config'
import Head from 'next/head'
import { loadSlugs, loadQuiz, loadRelated } from '../../lib/quiz'
import { Quiz } from '../../interfaces'
import CharacterQuiz from '../../components/characterQuiz/characterQuiz'
import PersonalityQuiz from '../../components/personalityQuiz/personalityQuiz'

const { publicRuntimeConfig } = getConfig()
const { url } = publicRuntimeConfig

type Props = {
    quiz: Quiz
    related: Array<any>
}

const Quiz = ({ quiz, related }: Props) => {
    const type: number = quiz.type
    return (
        <>
        <Head>
                <meta property='og:description' content={quiz.description} />
                <meta property='og:image' content={`${url}/assets/${quiz.featured_image}`} />
                <meta property='og:image:width' content='1200' />
                <meta property='og:image:height' content='630' />
                <meta property='og:url' content={`https://www.quizultra.com/${quiz.slug}`} />
        </Head>
        { type === 0 && <CharacterQuiz quiz={quiz} related={related} /> }
        { type === 1 && <PersonalityQuiz quiz={quiz} related={related} /> }
        { type === 2 && <PersonalityQuiz quiz={quiz} related={related} /> }
        </>
    )
}

export default Quiz

export const getStaticPaths = async () => {
    const slugs = await loadSlugs()
    return {
        paths: slugs,
        fallback: false,
    }
}

export const getStaticProps = async (context: any) => {
    const slug: any = context.params.quiz
    const quiz = await loadQuiz(slug)
    const related = await loadRelated(slug)
    return {
        props: { quiz: quiz, related: related },
        revalidate: 1,
    }
}
