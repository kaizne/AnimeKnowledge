import { getDirectusClient } from './directus'
import { supabase } from './supabase/supabase'
import { DirectusImage } from '../interfaces'

const findCharacterImage = (media: Array<DirectusImage>, character: string) => {
    for (let image of media)
        if (image.directus_files_id.title === character)
            return image.directus_files_id.id
    return ''
}

const loadCharacterQuiz = async (slug: string) => {
    const directus = await getDirectusClient()
    const quizzes = await directus.items('quizzes')
    const quizQuery = await quizzes.readByQuery({
        filter: { slug: { _eq: slug } }
    })

    let quiz: any = null
    
    if (quizQuery.data) {
        quiz = quizQuery.data[0]

        const { data, error } = await supabase
            .from(quiz.slug.replaceAll('-', '_'))
            .select()
            
        if (data && data.length > 0) quiz.leaderboard = data
        
        const mediaQuery = await quizzes.readOne(quiz.uuid, {
            fields: ['media.directus_files_id.id', 'media.directus_files_id.title']
        })

        const media: Array<DirectusImage> = mediaQuery.media

        quiz.media = media
        
        const characters: object = quiz.characters
        const questions = []

        if (characters)
            for (let group of Object.values(characters)) {
                for (let character of group) {
                    const entry: any = {}
                    const options: Array<string> = []
                    options.push(character)

                    for (let i = 0; i < 3; ++i) {
                        let random = Math.floor(Math.random() * group.length)
                        while (group[random] === character || options.includes(group[random]))
                            random = Math.floor(Math.random() * group.length)    
                        options.push(group[random])
                    }

                    entry.answer = character
                    entry.image = findCharacterImage(media, character)
                    entry.options = options
                    questions.push(entry)
                }        
            }

        quiz.questions = questions
    }
    return quiz
}

const loadPersonalityQuiz = async (slug :string) => {
    const directus = await getDirectusClient()
    const quizzes = await directus.items('quizzes')
    const quizQuery = await quizzes.readByQuery({
        filter: { slug: { _eq: slug } }
    })
    let quiz: any = null
    if (quizQuery.data) {
        quiz = quizQuery.data[0]
        const mediaQuery = await quizzes.readOne(quiz.uuid, {
            fields: ['media.directus_files_id.id', 'media.directus_files_id.title']
        })
        const media: Array<DirectusImage> = mediaQuery.media
        quiz.media = media
    }
    return quiz
}

const loadSlugs = async () => {
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

const loadQuiz = async (slug: string) => {
    const directus = await getDirectusClient()
    const quizzes = await directus.items('quizzes')
    const quizQuery = await quizzes.readByQuery({
        filter: { slug: { _eq: slug } }
    })

    let quiz: any = null
    
    if (quizQuery.data) {
        quiz = quizQuery.data[0]
        const type: number = quiz.type
        
        if (type === 0) { quiz = await loadCharacterQuiz(slug) }
        if (type === 1) { quiz = await loadPersonalityQuiz(slug) }
        if (type === 2) { quiz = await loadPersonalityQuiz(slug) }
    }

    const { data, error } = await supabase
        .from('quizzes')
        .select('plays, requests')
        .eq('slug', slug)
        
    if (data && data.length > 0 && data[0].requests) quiz.requests = data[0].requests
    if (data && data.length > 0 && data[0].plays) quiz.plays = data[0].plays
    return quiz
}

const loadRelated = async (slug: string) => {
    const directus = await getDirectusClient()
    const quizzes = await directus.items('quizzes')
    const quizQuery: any = await quizzes.readByQuery({
        filter: { slug: { _eq: slug } }
    })

    if (quizQuery && quizQuery.data) {
        const category = quizQuery.data[0]['category']
        const subcategory = quizQuery.data[0]['subcategory']

        const subcategoryQuery: any = await quizzes.readByQuery({
            filter: { subcategory: { _eq: subcategory }}
        })

        if (subcategoryQuery.data.length < 3) {
            const categoryQuery: any = await quizzes.readByQuery({
                filter: { category: { _eq: category }}
            })
            return [...subcategoryQuery.data, ...categoryQuery.data]
        }
        else {
            return subcategoryQuery.data
        }
    }
}

export { findCharacterImage, loadSlugs, loadQuiz, loadRelated }
