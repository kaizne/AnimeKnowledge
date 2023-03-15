import getConfig from 'next/config'
import { Directus } from '@directus/sdk'

const { publicRuntimeConfig, serverRuntimeConfig } = getConfig()

const { token } = serverRuntimeConfig
const { url } = publicRuntimeConfig 

const directus = new Directus(url)

export async function getDirectusClient() {
    await directus.auth.static(token)
    return directus
}

export async function getPublicDirectusClient() {
    return directus
}
