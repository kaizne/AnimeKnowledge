module.exports = {
    reactStrictMode: true,
    serverRuntimeConfig: {
        token: process.env.DIRECTUS_STATIC_TOKEN
    },
    publicRuntimeConfig: {
        url: process.env.DIRECTUS_URL
    },
    images: {
        domains: ['quizultra.directus.app'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'quizultra.directus.app',
                pathname: '/assets/*',
            }
        ]
    }
}
