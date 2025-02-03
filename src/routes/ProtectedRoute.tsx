import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { Forbidden } from '@/pages'
import { useAuthStore } from '@/stores'
import { LOCAL_STORAGE_KEYS, PATH } from '@/utils/constants'

type ProtectedRouteProps = {
  role: string
  children: ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, children }) => {
  const { currentUser } = useAuthStore()

  const isLoggedIn = localStorage.getItem(LOCAL_STORAGE_KEYS.isLoggedIn)

  if (!isLoggedIn) {
    return <Navigate to={PATH.login} replace />
  }

  if (currentUser && role !== currentUser?.role) {
    return <Forbidden />
  }
  return <>{children}</>
}
