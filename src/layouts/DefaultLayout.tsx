import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { userApi } from '@/apis'
import { useAuthStore } from '@/stores'
import { useApi, useBoolean } from '@/hooks'

import { Header, SideBar } from './partials'

export function DefaultLayout() {
  const sideBarVisible = useBoolean(false)
  const { setCurrentUser } = useAuthStore()
  const { callApi: callApiGetCurrentUser } = useApi<void>()

  const handleGetCurrentUser = () => {
    callApiGetCurrentUser(async () => {
      const { data } = await userApi.getCurrentUser()
      if (data) {
        setCurrentUser(data)
      }
    })
  }

  useEffect(() => {
    handleGetCurrentUser()
  }, [])

  return (
    <div>
      <SideBar sideBarVisible={sideBarVisible} />

      <div className='bg-[#eef3f8] min-h-screen'>
        <Header toggleSideBar={sideBarVisible.toggle} />
        <Outlet />
      </div>
    </div>
  )
}
