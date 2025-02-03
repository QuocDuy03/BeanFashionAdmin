import { useEffect, useRef, useState } from 'react'

import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button as Btn } from 'primereact/button'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import { ProgressSpinner } from 'primereact/progressspinner'

import { Button, DiscountPopup } from '@/components'
import { IDiscount } from '@/interfaces'
import { icons } from '@/utils'
import { useApi, useBoolean } from '@/hooks'
import { discountApi } from '@/apis'

export function Discount() {
  const toast = useRef<Toast>(null)
  const { loading, errorMessage, callApi: callApiDiscount } = useApi<void>()
  const [discountProducts, setDiscountProducts] = useState<IDiscount[]>([])
  const { value: isModalVisible, setTrue: showModal, setFalse: hideModal } = useBoolean(false)
  const { value: isDiscountProductChange, toggle: toggleDiscountProductChange } = useBoolean(false)
  const [selectedDiscountProducts, setSelectedDiscountProducts] = useState<IDiscount[]>([])
  const [selectedDiscountProduct, setSelectedDiscountProduct] = useState<IDiscount | null>(null)

  const showUpdateModal = (product: IDiscount) => {
    setSelectedDiscountProduct(product)
    showModal()
  }

  const removeDiscountProduct = async (id: string) => {
    setDiscountProducts((prevData) => prevData.filter((item) => item.id !== id))
    callApiDiscount(async () => {
      const { data } = await discountApi.delete(id)
      if (data) {
        toggleDiscountProductChange()
        setSelectedDiscountProducts((prevItems) => prevItems.filter((item) => item.id !== id))
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Remove Successfully', life: 3000 })
      } else {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: `${errorMessage}`, life: 3000 })
      }
    })
  }

  const removeMultipleDiscountProducts = async () => {
    const ids = selectedDiscountProducts?.map((product) => product.id) || []
    if (ids.length)
      callApiDiscount(async () => {
        const { data } = await discountApi.removeMultiple(ids)
        if (data) {
          toggleDiscountProductChange()
          setSelectedDiscountProducts([])
          toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Remove Successfully', life: 3000 })
        } else {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: `${errorMessage}`, life: 3000 })
        }
      })
  }

  const confirmRemove = (id: string) => {
    confirmDialog({
      message: 'Do you want to remove this discount?',
      header: 'Confirm Removal?',
      icon: icons.danger,
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Remove',
      rejectLabel: 'Cancel',
      accept: () => removeDiscountProduct(id)
    })
  }

  const confirmRemoveMultiple = () => {
    confirmDialog({
      message: 'Do you want to remove these discounts?',
      header: 'Confirm Removal?',
      icon: icons.danger,
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Remove',
      rejectLabel: 'Cancel',
      accept: () => removeMultipleDiscountProducts()
    })
  }

  const getAllDiscountProduct = async () => {
    callApiDiscount(async () => {
      const { data } = await discountApi.findAll()
      setDiscountProducts(data)
    })
  }
  useEffect(() => {
    getAllDiscountProduct()
  }, [isDiscountProductChange])

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
      <ConfirmDialog />
      <DiscountPopup
        visible={isModalVisible}
        setHide={hideModal}
        toggleDiscountProductChange={toggleDiscountProductChange}
        discountProduct={selectedDiscountProduct}
        resetUpdateDiscountValue={selectedDiscountProduct ? () => setSelectedDiscountProduct(null) : undefined}
      />
      <Card className='m-3 min-h-[85vh]'>
        <DataTable
          value={discountProducts}
          className='min-w-80'
          scrollable
          scrollHeight='638px'
          paginator
          emptyMessage={
            loading ? (
              <div className='flex flex-col items-center justify-center py-10 text-gray-500'>
                <ProgressSpinner />
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center py-10 text-gray-500'>
                <p className='text-lg font-semibold'>No Discount Found</p>
                <p className='text-sm'>Try adjusting your search or filter criteria.</p>
              </div>
            )
          }
          rows={7}
          rowsPerPageOptions={[7, 25, 50]}
          selection={selectedDiscountProducts.length ? selectedDiscountProducts : null}
          onSelectionChange={(e: any) => setSelectedDiscountProducts(e.value)}
          dataKey='id'
          header={
            <div className='flex justify-between items-center'>
              <div className='uppercase'>List Of Discount</div>
              <div className='flex gap-3'>
                <Button
                  children={
                    <div className='flex items-center gap-2'>
                      {icons.add}
                      <span>Add discount</span>
                    </div>
                  }
                  onClick={showModal}
                />
                <Button
                  type='danger'
                  children={
                    <div className='flex items-center gap-2'>
                      {icons.delete}
                      <span>Remove selected items</span>
                    </div>
                  }
                  disabled={!selectedDiscountProducts?.length}
                  onClick={confirmRemoveMultiple}
                />
              </div>
            </div>
          }
        >
          <Column selectionMode='multiple' headerStyle={{ width: '7%' }}></Column>
          <Column
            field='product.name'
            header='Product'
            bodyClassName={'capitalize'}
            headerStyle={{ width: '18.6%' }}
          ></Column>
          <Column
            field='discountValue'
            header='Discount Value (%)'
            bodyClassName={'capitalize'}
            headerStyle={{ width: '18.6%' }}
          ></Column>
          <Column
            field='timeRange'
            header='Time Range'
            bodyClassName={'capitalize'}
            headerStyle={{ width: '18.6%' }}
          ></Column>
          <Column
            field='date'
            header='Date'
            bodyClassName={'capitalize'}
            headerStyle={{ width: '18.6%' }}
            body={(rowData) => new Date(rowData.date).toLocaleDateString()}
          ></Column>
          <Column
            header='Action'
            headerStyle={{ width: '18.6%' }}
            body={(rowData) => (
              <>
                <Btn
                  icon={icons.update}
                  title='Update'
                  label='Update'
                  severity='success'
                  text
                  raised
                  disabled={loading}
                  loading={loading}
                  onClick={() => showUpdateModal(rowData)}
                  className='mx-1 gap-2'
                  size='small'
                />
                <Btn
                  icon={icons.delete}
                  title='Remove'
                  label='Remove'
                  severity='danger'
                  text
                  raised
                  disabled={loading}
                  loading={loading}
                  onClick={() => confirmRemove(rowData.id)}
                  className='mx-1 gap-2'
                  size='small'
                />
              </>
            )}
          />
        </DataTable>
      </Card>
    </>
  )
}
