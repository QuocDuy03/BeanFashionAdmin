import { useAuthStore } from '@/stores'
import { PATH } from '@/utils'
import React, { ReactElement } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

type SideBarItemProps = {
  path: string
  icon: ReactElement
  title: string
  onClick: (data?: unknown) => void
}
export const SideBarItem: React.FC<SideBarItemProps> = ({ path, icon, title, onClick }) => {
  const location = useLocation()
  const isActive = location.pathname === path
  const itemClassName = `w-full flex gap-4 items-center pl-6 hover:bg-slate-100 py-3 text-md transition-all duration-75 ${isActive && 'font-semibold text-black'}`
  const navigate = useNavigate()
  const { setCurrentUser } = useAuthStore()

  const handleLogout = () => {
    setCurrentUser(null)
    navigate(PATH.login)
  }
  return (
    <div>
      {path !== PATH.logout ? (
        <Link onClick={onClick} className={itemClassName} to={path}>
          <span className='text-partial-primary-700'>{icon}</span>
          <span>{title}</span>
        </Link>
      ) : (
        <div onClick={() => onClick(handleLogout)} className={`${itemClassName} hover:cursor-pointer`}>
          <span className='text-partial-primary-700'>{icon}</span>
          <span>{title}</span>
        </div>
      )}
    </div>
  )
}
