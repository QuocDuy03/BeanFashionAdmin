import { useEffect, useRef } from 'react'

import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast'

import { useApi } from '@/hooks'
import { manageCategoryApi } from '@/apis'
import { ICategoryInput, ICategory } from '@/interfaces'

import { Button } from './CustomComponents/CustomButton'
import { Input } from './CustomComponents/CustomInput'

type DialogComp = {
  visible: boolean
  setHide: () => void
  toggleCategoryChange: () => void
  category: ICategory | null
  resetUpdateCategoryValue?: () => void
}

const categorySchema = yup.object().shape({
  gender: yup.string().required('Gender is a required field'),
  type: yup.string().required('Type is a required field')
})

export const CategoryPopup: React.FC<DialogComp> = ({
  visible,
  setHide,
  toggleCategoryChange,
  category,
  resetUpdateCategoryValue
}) => {
  const toast = useRef<Toast>(null)
  const { loading, errorMessage, callApi: callApiManageCategory } = useApi<void>()
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      gender: '',
      type: ''
    }
  })
  const handleClose = () => {
    setHide()
    reset()
    if (resetUpdateCategoryValue) {
      resetUpdateCategoryValue()
    }
  }

  const handleAddCategory = (categoryData: ICategoryInput) => {
    callApiManageCategory(async () => {
      const { data } = await manageCategoryApi.create(categoryData)
      if (data) {
        reset()
        setHide()
        toggleCategoryChange()
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Add category successfully',
          life: 3000
        })
      }
    })
  }

  const handleUpdateCategory = (id: string, categoryData: ICategoryInput) => {
    callApiManageCategory(async () => {
      const { data } = await manageCategoryApi.update(id, categoryData)
      if (data) {
        reset()
        setHide()
        toggleCategoryChange()
        if (resetUpdateCategoryValue) {
          resetUpdateCategoryValue()
        }
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Update category successfully',
          life: 3000
        })
      }
    })
  }

  const handleSubmitForm = (categoryData: ICategoryInput) => {
    const data = {
      gender: categoryData.gender.toLowerCase(),
      type: categoryData.type.toLowerCase()
    }
    if (category?.id) {
      handleUpdateCategory(category.id, data)
    } else {
      handleAddCategory(data)
    }
  }

  useEffect(() => {
    reset(category ? { gender: category.gender, type: category.type } : { gender: '', type: '' })
  }, [category, reset])
  useEffect(() => {
    if (errorMessage)
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: `${errorMessage}`,
        life: 3000
      })
  }, [errorMessage])
  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        onHide={handleClose}
        header={category?.id ? 'Update category' : 'Add category'}
        style={{ width: '30vw' }}
      >
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <div className='p-1 mb-3'>
            <Input
              label='Gender'
              type='text'
              name='gender'
              placeholder='Enter gender'
              control={control}
              errors={errors}
              className='w-full'
            />
          </div>
          <div className='p-1 mb-3'>
            <Input
              label='Type'
              type='text'
              name='type'
              placeholder='Enter type'
              control={control}
              errors={errors}
              className='w-full'
            />
          </div>
          <div className='flex justify-end gap-3'>
            <Button
              children={'Cancel'}
              htmlType='reset'
              className='bg-transparent border-black text-black hover:opacity-65'
              onClick={handleClose}
            />
            <Button
              children={category?.id ? 'Update' : 'Add'}
              loading={loading}
              disabled={loading || !isDirty}
              htmlType='submit'
            />
          </div>
        </form>
      </Dialog>
    </>
  )
}
