import { SideBarItem } from '@/components/SideBarItem'
import { IUseBooleanReturn } from '@/interfaces'
import React, { ReactElement } from 'react'

type SideBarMenuItemProps = {
  group?: string
  items: SideBarItemType[]
  sideBarVisible: IUseBooleanReturn
}
type SideBarItemType = {
  path: string
  icon: ReactElement
  title: string
  onClick?: (data?: any) => void
}

export const SideBarMenuItem: React.FC<SideBarMenuItemProps> = ({ group, items, sideBarVisible }) => {
  const handleItemClick = (item: SideBarItemType) => {
    item.onClick && item.onClick()
    sideBarVisible.setFalse()
  }
  return (
    <div>
      {group && <div className='py-2 pl-6 text-lg font-bold select-none text-partial-primary-700'>{group}</div>}
      {items.map((item, index) => (
        <SideBarItem key={`sidebar-item-${index}`} onClick={() => handleItemClick(item)} {...item} />
      ))}
    </div>
  )
}
