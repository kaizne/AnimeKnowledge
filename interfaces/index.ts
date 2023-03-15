export type DirectusImage = {
  directus_files_id: {
    id: string
    title: string
  }
}

export type Quiz = {
  uuid: string
  slug: string
  type: number
  meta_title: string,
  meta_description: string,
  title: string
  featured_image: string
  featured_media: string
  description: string
  characters: object
  media: Array<DirectusImage>
  questions: Array<object>
  requests: number
  plays: number
  date_created: string
  date_updated: string
  leaderboard: Array<object>
}

export interface CharacterQuiz {
  uuid: string
  slug: string
  type: number
  meta_title: string,
  meta_description: string,
  title: string
  featured_image: string
  featured_media: string
  description: string
  characters: object
  media: Array<DirectusImage>
  questions: Array<object>
  requests: number
  plays: number
  date_created: string
  date_updated: string
  leaderboard: Array<object>
}
