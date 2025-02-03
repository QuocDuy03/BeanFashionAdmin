import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Button } from 'primereact/button'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { Paginator } from 'primereact/paginator'
import { Toast } from 'primereact/toast'

import { icons, FilterOptions, SortOptions } from '@/utils'
import { orderApi } from '@/apis'
import { useApi } from '@/hooks'
import { IOrderReturn, IQuery, IToastFunctionOptions } from '@/interfaces'
import { Table } from './Table'
import { filterOptions, selectedOptionTemplate, sortOptions, sortOptionTemplate } from './DropdownOption'

type PaginationType = {
  totalPages?: number
  totalOrders?: number
  currentPage?: number
  limit?: number
}
export function Orders() {
  const toast = useRef<Toast>(null)
  const { loading: callOrderApiLoading, callApi: callOrderApi } = useApi<void>()
  const [searchParam, setSearchParam] = useSearchParams()
  const [orders, setOrders] = useState<IOrderReturn[]>([])
  const [selectedOrder, setSelectedOrder] = useState<IOrderReturn>()
  const [pagination, setPagination] = useState<PaginationType>({})
  const [inputKeyword, setInputKeyword] = useState<string>(searchParam.get('keyword') || '')
  const [currentSearchParams, setCurrentSearchParams] = useState<IQuery>({
    page: parseInt(searchParam.get('page') || '1'),
    limit: parseInt(searchParam.get('limit') || '5'),
    sortBy: (searchParam.get('sortBy') as SortOptions) ?? SortOptions.DateDecrease,
    filter: (searchParam.get('filter') as FilterOptions) ?? FilterOptions.None,
    keyword: searchParam.get('keyword') ?? ''
  })
  const showToast = (toasParams: IToastFunctionOptions) => {
    toast.current?.show({
      severity: toasParams.severity,
      summary: toasParams.summary,
      detail: toasParams.detail,
      life: toasParams.life
    })
  }
  const deleteConfirm = () => {
    confirmDialog({
      message: 'Are you sure you want to delete this order?',
      header: 'Delete',
      icon: <span className='text-red-500 text-2xl'>{icons.warning}</span>,
      defaultFocus: 'accept',
      accept: () => handleDeleteOrder(),
      reject: () => {}
    })
  }
  const handleDeleteOrder = () => {
    selectedOrder &&
      callOrderApi(async () => {
        const data = await orderApi.deleteOrder(selectedOrder.id)
        if (data) {
          fetchOrderWithCurrentParams()
          showToast({ severity: 'success', summary: 'Success', detail: 'Order deleted successfully!', life: 3000 })
        } else {
          showToast({ severity: 'error', summary: 'Error', detail: 'Delete order failed!', life: 3000 })
        }
      })
  }
  const handleRestoreOrder = () => {
    selectedOrder &&
      callOrderApi(async () => {
        const data = await orderApi.restoreOrder(selectedOrder.id)
        if (data) {
          fetchOrderWithCurrentParams()
          showToast({ severity: 'success', summary: 'Success', detail: 'Order restored successfully!', life: 3000 })
        } else {
          showToast({ severity: 'error', summary: 'Error', detail: 'Restore order failed!', life: 3000 })
        }
      })
  }
  const getSearchParams = (params: IQuery) => {
    const filteredParams = Object.fromEntries(Object.entries(params).filter(([, value]) => value))
    const queryString = new URLSearchParams(filteredParams as Record<string, string>).toString()
    return `?${queryString}`
  }
  const fetchOrders = (params: IQuery) => {
    callOrderApi(async () => {
      const data = await orderApi.getOrders(params)
      if (data) {
        setOrders(data?.data?.orders || [])
        setPagination(data?.data?.pagination || {})
        const search = getSearchParams(params)
        setSearchParam(search, { replace: true })
        setCurrentSearchParams(params)
      } else {
        showToast({ severity: 'error', summary: 'Error', detail: 'Fetch orders failed!', life: 3000 })
      }
    })
  }
  const fetchOrderWithCurrentParams = () => {
    fetchOrders(currentSearchParams)
  }
  const onChangePage = (page: number, size: number) => {
    if (page !== pagination.currentPage || size != pagination.limit) {
      if (inputKeyword !== currentSearchParams.keyword) {
        setInputKeyword(currentSearchParams.keyword || '')
      }
      fetchOrders({
        ...currentSearchParams,
        page,
        limit: size
      })
    }
  }
  const handleSearchOrder = () => {
    if (inputKeyword !== currentSearchParams.keyword) {
      setCurrentSearchParams({ ...currentSearchParams, keyword: inputKeyword })
      fetchOrders({
        ...currentSearchParams,
        page: 1,
        limit: pagination.limit || 5,
        keyword: inputKeyword ? inputKeyword : undefined
      })
    }
  }
  const handleChangeSortOption = (sortBy: SortOptions) => {
    setCurrentSearchParams({ ...currentSearchParams, sortBy: sortBy })
    fetchOrders({ ...currentSearchParams, sortBy })
  }
  const handleChangeFilterOption = (filter: FilterOptions) => {
    setCurrentSearchParams({ ...currentSearchParams, filter: filter })
    fetchOrders({ ...currentSearchParams, filter })
  }
  useEffect(() => {
    fetchOrderWithCurrentParams()
  }, [])
  return (
    <div className='w-full h-full'>
      <Toast ref={toast} />
      <div className='h-full w-[95%] m-auto'>
        <div className='flex flex-row w-[95%] h-fit justify-between m-auto mt-6   mb-4'>
          <div className='text-black-light text-2xl font-bold leading-tight text-left'>Order List</div>
          <div>
            <div className='flex items-end gap-4'>
              <div className='flex items-center gap-2'>
                <span className='flex items-center text-lg text-black'>Filter:</span>
                <Dropdown
                  value={currentSearchParams.filter}
                  onChange={(e) => handleChangeFilterOption(e.value)}
                  options={filterOptions}
                  optionLabel='label'
                  optionValue='value'
                  className='w-40'
                />
              </div>
              <div className='flex items-center gap-2'>
                <span className='flex items-center text-lg text-black'>Sort:</span>
                <Dropdown
                  optionLabel='label'
                  optionValue='value'
                  value={currentSearchParams.sortBy}
                  onChange={(e) => handleChangeSortOption(e.value)}
                  options={sortOptions}
                  valueTemplate={selectedOptionTemplate}
                  itemTemplate={sortOptionTemplate}
                  className='w-36'
                />
              </div>
              <div className={`relative flex items-center gap-2 `}>
                <Button
                  size='small'
                  className='absolute w-10 h-10 p-2 text-2xl text-gray-500 ring-0 left-1'
                  type='submit'
                  rounded
                  text
                  icon={icons.search}
                  onClick={handleSearchOrder}
                ></Button>
                <InputText
                  placeholder='Order ID, Product name,...'
                  size={'small'}
                  className={` pl-10  w-80 `}
                  onChange={(e) => setInputKeyword(e.target.value)}
                  value={inputKeyword}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchOrder()
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <Table
          orders={orders}
          callOrderApiLoading={callOrderApiLoading}
          setSelectedOrder={setSelectedOrder}
          selectedOrder={selectedOrder}
          handleRestoreOrder={handleRestoreOrder}
          deleteConfirm={deleteConfirm}
        />
        <div className=' bg-white rounded-b-lg'>
          <div>
            <Paginator
              rows={pagination?.limit}
              first={((pagination?.currentPage || 1) - 1) * (pagination?.limit || 5)}
              totalRecords={pagination?.totalOrders}
              rowsPerPageOptions={[pagination?.limit && pagination?.limit < 10 ? pagination.limit : 5, 10, 25, 50]}
              onPageChange={(e) => onChangePage(e.page + 1, e.rows)}
            />
          </div>
        </div>
      </div>
      <ConfirmDialog
        acceptClassName='bg-red-500 opacity-95 ring-0 border-none hover:opacity-100 hover:drop-shadow-md'
        rejectClassName='text-slate-500 bg-transparent ring-0 border-none hover:opacity-90'
      />
    </div>
  )
}
