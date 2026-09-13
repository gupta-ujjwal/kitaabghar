export interface Profile {
  name: string
  bio?: string
  favoriteGenre?: string
}

export const EMPTY_PROFILE: Profile = { name: '' }
