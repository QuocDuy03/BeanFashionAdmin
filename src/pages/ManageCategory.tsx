import { useEffect, useRef, useState } from 'react'

import { Card } from 'primereact/card'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button as Btn } from 'primereact/button'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import { ProgressSpinner } from 'primereact/progressspinner'

import { CategoryPopup, Button } from '@/components'
import { ICategory } from '@/interfaces'
import { icons } from '@/utils'
import { useApi, useBoolean } from '@/hooks'
import { manageCategoryApi } from '@/apis'

export function ManageCategory() {
  const toast = useRef<Toast>(null)
  const { loading, errorMessage, callApi: callApiManageCategory } = useApi<void>()
  const [categories, setCategories] = useState<ICategory[]>([])
  const { value: isModalVisible, setTrue: showModal, setFalse: hideModal } = useBoolean(false)
  const { value: isCategoryChange, toggle: toggleCategoryChange } = useBoolean(false)
  const [selectedCategories, setSelectedCategories] = useState<ICategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null)

  const showUpdateModal = (category: ICategory) => {
    setSelectedCategory(category)
    showModal()
  }

  const removeCategory = async (id: string) => {
    setCategories((prevData) => prevData.filter((item) => item.id !== id))
    callApiManageCategory(async () => {
      const { data } = await manageCategoryApi.delete(id)
      if (data) {
        toggleCategoryChange()
        setSelectedCategories((prevItems) => prevItems.filter((item) => item.id !== id))
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Remove Successfully', life: 3000 })
      } else {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: `${errorMessage}`, life: 3000 })
      }
    })
  }

  const removeMultipleCaregories = async () => {
    const ids = selectedCategories?.map((category) => category.id) || []
    if (ids.length)
      callApiManageCategory(async () => {
        const { data } = await manageCategoryApi.removeMultiple(ids)
        if (data) {
          toggleCategoryChange()
          setSelectedCategories([])
          toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Remove Successfully', life: 3000 })
        } else {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: `${errorMessage}`, life: 3000 })
        }
      })
  }

  const confirmRemove = (id: string) => {
    confirmDialog({
      message: 'Do you want to remove this category?',
      header: 'Confirm Removal?',
      icon: icons.danger,
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Remove',
      rejectLabel: 'Cancel',
      accept: () => removeCategory(id)
    })
  }

  const confirmRemoveMultiple = () => {
    confirmDialog({
      message: 'Do you want to remove these categories?',
      header: 'Confirm Removal?',
      icon: icons.danger,
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger',
      acceptLabel: 'Remove',
      rejectLabel: 'Cancel',
      accept: () => removeMultipleCaregories()
    })
  }

  const getAllCategories = async () => {
    callApiManageCategory(async () => {
      const { data } = await manageCategoryApi.findAll()
      setCategories(data)
    })
  }
  useEffect(() => {
    getAllCategories()
  }, [isCategoryChange])

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
      <CategoryPopup
        visible={isModalVisible}
        setHide={hideModal}
        toggleCategoryChange={toggleCategoryChange}
        category={selectedCategory}
        resetUpdateCategoryValue={selectedCategory ? () => setSelectedCategory(null) : undefined}
      />
      <Card className='m-3 min-h-[85vh]'>
        <DataTable
          value={categories}
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
                <p className='text-lg font-semibold'>No Category Found</p>
                <p className='text-sm'>Try adjusting your search or filter criteria.</p>
              </div>
            )
          }
          rows={7}
          rowsPerPageOptions={[7, 25, 50]}
          selection={selectedCategories.length ? selectedCategories : null}
          onSelectionChange={(e: any) => setSelectedCategories(e.value)}
          dataKey='id'
          header={
            <div className='flex justify-between items-center'>
              <div className='uppercase'>List Of Categories</div>
              <div className='flex gap-3'>
                <Button
                  children={
                    <div className='flex items-center gap-2'>
                      {icons.add}
                      <span>Add category</span>
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
                  disabled={!selectedCategories?.length}
                  onClick={confirmRemoveMultiple}
                />
              </div>
            </div>
          }
        >
          <Column selectionMode='multiple' headerStyle={{ width: '7%' }}></Column>
          <Column field='gender' header='Gender' bodyClassName={'capitalize'} headerStyle={{ width: '31%' }}></Column>
          <Column field='type' header='Type' bodyClassName={'capitalize'} headerStyle={{ width: '31%' }}></Column>
          <Column
            header='Action'
            headerStyle={{ width: '31%' }}
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
