import { ReactElement } from 'react'

import { PATH } from '@/utils/constants/paths'
import { icons } from '@/utils/icons'
import { instance as axiosClient } from '@/configs'
import { LOCAL_STORAGE_KEYS } from '@/utils/constants/localStorageKeys'

type SideBarItemType = {
  path: string
  icon: ReactElement
  title: string
  onClick?: (data?: any) => void
}
type SideBarMenuItemProps = {
  group?: string
  items: SideBarItemType[]
}
export const SIDE_BAR_ITEM_LIST: SideBarMenuItemProps[] = [
  {
    group: 'DASHBOARDS',
    items: [
      {
        path: PATH.dashboard,
        icon: icons.home,
        title: 'Dashboard'
      },
      {
        path: PATH.orders,
        icon: icons.orders,
        title: 'Orders'
      }
    ]
  },
  {
    group: 'Products',
    items: [
      {
        path: PATH.product,
        icon: icons.product,
        title: 'All Products'
      },
      {
        path: PATH.manageCategory,
        icon: icons.category,
        title: 'Category'
      },
      {
        path: PATH.discount,
        icon: icons.discount,
        title: 'Discount'
      }
    ]
  },
  {
    group: 'Blogs',
    items: [
      {
        path: PATH.blogList,
        icon: icons.blogList,
        title: 'All Blogs'
      },
      {
        path: PATH.blogCreate,
        icon: icons.create,
        title: 'Create Blog'
      }
    ]
  },
  {
    items: [
      {
        path: PATH.logout,
        icon: icons.logout,
        title: 'Logout',
        onClick: async (func: () => void) => {
          const response = await axiosClient.delete('/auth/logout')
          localStorage.removeItem(LOCAL_STORAGE_KEYS.isLoggedIn)
          const isLoggedIn = localStorage.getItem(LOCAL_STORAGE_KEYS.isLoggedIn)
          if (response && !isLoggedIn) {
            func()
          }
        }
      }
    ]
  }
]
