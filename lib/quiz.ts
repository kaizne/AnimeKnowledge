import { getDirectusClient } from './directus'

export const loadSlugs = async () => {
    const directus = await getDirectusClient()
    const quizzes = await directus.items('quizzes')
    const quizzesQuery: any = await quizzes.readByQuery({
        limit: -1
    })
    const slugs = quizzesQuery.data.map((quiz: any) => { 
        return { params: { quiz: quiz.slug } }
    })
    return slugs
}