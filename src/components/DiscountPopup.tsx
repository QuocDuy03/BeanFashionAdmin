import { useEffect, useRef, useState } from 'react'

import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import { useApi } from '@/hooks'
import { discountApi, productApi } from '@/apis'
import { IDiscount, IDiscountInput, IProduct } from '@/interfaces'

import { Button } from './CustomComponents/CustomButton'
import { Input } from './CustomComponents/CustomInput'

dayjs.extend(utc)
dayjs.extend(timezone)

type DialogComp = {
  visible: boolean
  setHide: () => void
  toggleDiscountProductChange: () => void
  discountProduct: IDiscount | null
  resetUpdateDiscountValue?: () => void
}

export const DiscountPopup: React.FC<DialogComp> = ({
  visible,
  setHide,
  toggleDiscountProductChange,
  discountProduct,
  resetUpdateDiscountValue
}) => {
  const toast = useRef<Toast>(null)
  const { loading, errorMessage, callApi: callApiDiscount } = useApi<void>()
  const { callApi: callApiManageProduct } = useApi<void>()
  const [products, setProducts] = useState<IProduct[]>([])
  const getAllProducts = async () => {
    callApiManageProduct(async () => {
      const { data } = await productApi.findAllProducts()
      setProducts(data)
    })
  }

  const validProductIds = products.map((p) => p.id)
  const discountSchema = yup.object().shape({
    discountValue: yup
      .number()
      .min(1, 'Discount value cannot be less than 1')
      .max(99, 'Discount value cannot be greater than 99')
      .required('Discount value is a required field'),
    timeRange: yup.string().oneOf(['0h-6h', '6h-12h', '12h-18h', '18h-24h']).required('Time range is a required field'),
    date: yup.date().required('Date is a required field'),
    productId: yup.string().required('Product is a required field').oneOf(validProductIds)
  })
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    resolver: yupResolver(discountSchema),
    defaultValues: {
      discountValue: 0,
      timeRange: undefined,
      date: new Date(),
      productId: ''
    }
  })

  const handleClose = () => {
    setHide()
    reset()
    if (resetUpdateDiscountValue) {
      resetUpdateDiscountValue()
    }
  }

  const handleAddDiscount = (discountData: IDiscountInput) => {
    const adjustedDiscountData = {
      ...discountData,
      date: dayjs(discountData.date).hour(0).minute(0).second(0).millisecond(0).tz('UTC', true).toDate()
    }

    callApiDiscount(async () => {
      const { data } = await discountApi.create(adjustedDiscountData)
      if (data) {
        reset()
        setHide()
        toggleDiscountProductChange()
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Add discount successfully!',
          life: 3000
        })
      }
    })
  }

  const handleUpdateDiscount = (id: string, discountData: IDiscountInput) => {
    const adjustedDiscountData = {
      ...discountData,
      date: dayjs(discountData.date).hour(0).minute(0).second(0).millisecond(0).tz('UTC', true).toDate()
    }
    callApiDiscount(async () => {
      const { data } = await discountApi.update(id, adjustedDiscountData)
      if (data) {
        reset()
        setHide()
        toggleDiscountProductChange()
        if (resetUpdateDiscountValue) {
          resetUpdateDiscountValue()
        }
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Update discount successfully!',
          life: 3000
        })
      }
    })
  }

  const handleSubmitForm = (discountData: IDiscountInput) => {
    if (discountProduct?.id) {
      handleUpdateDiscount(discountProduct.id, discountData)
    } else {
      handleAddDiscount(discountData)
    }
  }

  useEffect(() => {
    getAllProducts()
  }, [])

  useEffect(() => {
    reset({
      discountValue: discountProduct?.discountValue || 0,
      timeRange: discountProduct?.timeRange || undefined,
      date: discountProduct ? new Date(discountProduct.date) : new Date(),
      productId: discountProduct?.product.id || ''
    })
  }, [discountProduct, reset])

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
        header={discountProduct?.id ? 'Update discount' : 'Add discount'}
        style={{ width: '30vw' }}
      >
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <div className='p-1'>
            <Input
              label='Product'
              errors={errors}
              control={control}
              name='productId'
              type='select'
              placeholder='Select product'
              options={products}
              optionLabel='name'
              optionValue='id'
              className='w-full !p-0'
              size='medium'
            />
          </div>
          <div className='p-1'>
            <Input
              label='Discount value (%)'
              errors={errors}
              control={control}
              name='discountValue'
              type='number'
              placeholder='Enter discount value'
              className='w-full text-[16px] leading-[30px]'
            />
          </div>
          <div className='p-1'>
            <Input
              label='Time range'
              errors={errors}
              control={control}
              name='timeRange'
              type='select'
              placeholder='Select time range'
              options={['0h-6h', '6h-12h', '12h-18h', '18h-24h']}
              className='w-full !p-0'
              size='medium'
            />
          </div>
          <div className='p-1 mb-3'>
            <Input
              label='Discount date'
              errors={errors}
              control={control}
              name='date'
              type='calendar'
              placeholder='Select discount date'
              className='w-full !p-0 leading-[22px]'
              size='medium'
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
              children={discountProduct?.id ? 'Update' : 'Add'}
              loading={loading}
              disabled={!isDirty || loading}
              htmlType='submit'
            />
          </div>
        </form>
      </Dialog>
    </>
  )
}
