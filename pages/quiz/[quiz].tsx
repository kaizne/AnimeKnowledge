import { loadSlugs } from '../../lib/quiz'

const Quiz = () => {
    return (
        <div>This site is undergoing maintenance!</div>
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
    console.log(slug)
    return {
        props: {}
    }
}
