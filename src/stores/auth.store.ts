import { create } from 'zustand'
import { ICurrentUser } from '@/interfaces'
import { LOCAL_STORAGE_KEYS } from '@/utils'

type AuthState = {
  currentUser: ICurrentUser | null
  error: string | null
  message: string
  isLoggedIn: boolean
}
type AuthAction = {
  resetMessage: () => void
  setCurrentUser: (currentUser: ICurrentUser | null) => void
}
export const useAuthStore = create<AuthState & AuthAction>((set) => ({
  currentUser: null,
  error: null,
  message: '',
  isLoggedIn: !!localStorage.getItem(LOCAL_STORAGE_KEYS.isLoggedIn),
  setCurrentUser: (currentUser) => set({ currentUser }),
  resetMessage: () => set({ message: '', error: null })
}))
