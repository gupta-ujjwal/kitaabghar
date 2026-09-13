import type { Profile } from '../types/profile'
import { EMPTY_PROFILE } from '../types/profile'
import { useIndexedDB } from './useIndexedDB'

const STORAGE_KEY = 'kitaabghar:profile'

export function useProfile() {
  const [profile, setProfile, loaded] = useIndexedDB<Profile>(STORAGE_KEY, EMPTY_PROFILE)

  function updateProfile(updates: Partial<Profile>) {
    setProfile((prev) => ({ ...prev, ...updates }))
  }

  function clearProfile() {
    setProfile(EMPTY_PROFILE)
  }

  return { profile, updateProfile, clearProfile, loaded }
}
