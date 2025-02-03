import { Menu } from 'primereact/menu'
import { Sidebar } from 'primereact/sidebar'

import { SideBarMenuItem } from '@/components'
import { IUseBooleanReturn } from '@/interfaces'
import { SIDE_BAR_ITEM_LIST } from '@/utils/constants'

type ISideBar = {
  sideBarVisible: IUseBooleanReturn
}

export const SideBar: React.FC<ISideBar> = ({ sideBarVisible }) => {
  const sideBarItems = SIDE_BAR_ITEM_LIST.map((item) => ({
    template: <SideBarMenuItem sideBarVisible={sideBarVisible} {...item} />
  }))

  return (
    <div>
      <Sidebar
        showCloseIcon={false}
        visible={sideBarVisible.value}
        modal={false}
        onHide={() => sideBarVisible.setFalse()}
        className='drop-shadow-sidebar'
        header={
          <div className='flex items-center justify-center w-full'>
            <div className='w-3/4'>
              <img src='/logo.webp' />
            </div>
          </div>
        }
        pt={{
          content: () => ({
            className: 'p-0'
          })
        }}
      >
        <div className='w-full'>
          <Menu model={sideBarItems} className='w-full border-0' />
        </div>
      </Sidebar>
    </div>
  )
}
