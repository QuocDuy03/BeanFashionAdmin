import React from 'react'

import { BreadCrumb } from 'primereact/breadcrumb'
import { Button } from 'primereact/button'
import { Avatar } from 'primereact/avatar'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { Search } from '@/components'
import { getBreadCrumLabel, icons } from '@/utils'
import { useAuthStore } from '@/stores'

type HeaderProps = {
  toggleSideBar: () => void
}
export const Header: React.FC<HeaderProps> = ({ toggleSideBar }) => {
  const { currentUser } = useAuthStore()
  const defaultValues = {
    searchValue: ''
  }
  const schema = yup.object().shape({
    searchValue: yup.string().trim().required('Vui lòng nhập giá trị cần tìm!')
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({ defaultValues, resolver: yupResolver(schema) })
  const onSubmit = () => {
    reset()
  }
  const breadCrumItems = getBreadCrumLabel(location)
  const home = { icon: icons.home, url: '#' }

  return (
    <div className='flex justify-between px-10 py-4'>
      <div className='flex'>
        <Button
          className='text-2xl text-partial-primary-500 hover:bg-partial-primary-500 hover:text-white ring-0 '
          rounded
          text
          icon={icons.menu}
          onClick={toggleSideBar}
        ></Button>
        <BreadCrumb
          separatorIcon={icons.slash}
          className='text-sm font-semibold bg-transparent border-none'
          model={breadCrumItems}
          home={home}
        />
      </div>
      <div className='flex items-center gap-5'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Search className='border-partial-primary-500' control={control} errors={errors} size='small' />
        </form>
        <div className='text-gray-600'>{icons.setting}</div>
        <Button className='p-0 ring-0' rounded text>
          <span className='px-2'>Hi {currentUser?.fullName}!</span>
          <Avatar
            icon={icons.user}
            image={currentUser?.avatar}
            className='text-white bg-partial-primary-500'
            shape='circle'
          />
        </Button>
      </div>
    </div>
  )
}
