import React, { Dispatch, SetStateAction, useRef } from 'react'
import { Link } from 'react-router-dom'

import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { OverlayPanel } from 'primereact/overlaypanel'

import { IOrderReturn } from '@/interfaces'
import { ConvertDateString, ConvertTimeString, icons, OrderStatus, PaymentMethod, PaymentStatus } from '@/utils'

type TableProps = {
  orders: IOrderReturn[]
  callOrderApiLoading: boolean
  setSelectedOrder: Dispatch<SetStateAction<IOrderReturn | undefined>>
  selectedOrder?: IOrderReturn
  handleRestoreOrder: () => void
  deleteConfirm: () => void
}
export const Table: React.FC<TableProps> = ({
  orders,
  callOrderApiLoading,
  setSelectedOrder,
  selectedOrder,
  handleRestoreOrder,
  deleteConfirm
}) => {
  const dropdownControlRef = useRef<OverlayPanel>(null)
  const handleRestore = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (dropdownControlRef.current) {
      dropdownControlRef.current.toggle(e)
    }
    handleRestoreOrder()
  }
  return (
    <div>
      <DataTable
        onMouseDownCapture={(e) => {
          e.stopPropagation()
        }}
        value={orders}
        tableStyle={{ minWidth: '50rem' }}
        loading={callOrderApiLoading}
        className='rounded-t-lg overflow-hidden'
      >
        <Column
          alignHeader={'center'}
          header='ID'
          body={(data: IOrderReturn) => (
            <div
              className={`text-left font-semibold !select-text ${data.deletedAt && 'text-red-500 line-through opacity-50'}`}
            >
              {data.id}
            </div>
          )}
        />
        <Column
          alignHeader={'center'}
          header='User'
          body={(data: IOrderReturn) => (
            <div className={`text-left ${data.deletedAt && 'line-through opacity-50'}`}>{data?.user?.email}</div>
          )}
        />
        <Column
          alignHeader={'center'}
          header='Product'
          body={(data: IOrderReturn) => (
            <div className={`text-left flex items-start gap-2 ${data.deletedAt && 'opacity-50'}`}>
              <img className='w-20 h-auto' src={data?.products[0]?.imgUrl}></img>
              <div className='flex flex-col '>
                <div className='max-w-48 line-clamp-2 font-semibold'>{data?.products[0]?.name}</div>
                <div className='capitalize'>
                  {data?.products[0]?.colorName} / {data?.products[0]?.size}
                </div>
                <div className={`font-semibold text-red-500 ${data.deletedAt && 'line-through'}`}>
                  {data?.products[0]?.price.toLocaleString('de-De')}đ
                </div>
              </div>{' '}
            </div>
          )}
        />
        <Column
          alignHeader={'right'}
          header='Total price'
          body={(data: IOrderReturn) => (
            <div className={`text-red-500 text-right ${data.deletedAt && 'line-through opacity-50'}`}>
              {data.totalPrice.toLocaleString('de-DE')}đ
            </div>
          )}
        />
        <Column
          alignHeader={'center'}
          header='Order status'
          body={(data: IOrderReturn) => (
            <div className={`${data.deletedAt && 'line-through opacity-50'}`}>
              {
                <div
                  className={` text-center ${
                    [OrderStatus.Delivered, OrderStatus.Confirmed, OrderStatus.Delivering].includes(data?.orderStatus)
                      ? 'text-green-500'
                      : data?.orderStatus === OrderStatus.Pending
                        ? 'text-slate-500'
                        : 'text-red-500'
                  }`}
                >
                  {data?.orderStatus}
                </div>
              }
            </div>
          )}
        />
        <Column
          alignHeader={'center'}
          header='Payment status'
          body={(data: IOrderReturn) => (
            <div className={`${data.deletedAt && 'line-through opacity-50'}`}>
              {
                <div
                  className={` text-center ${
                    data.paymentStatus === PaymentStatus.Paid ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {data.paymentStatus}
                </div>
              }
            </div>
          )}
        />
        <Column
          alignHeader={'center'}
          header='Method'
          body={(data: IOrderReturn) => (
            <div className={`${data.deletedAt && 'line-through opacity-50'}`}>
              {
                <div
                  className={` text-center ${data.paymentMethod === PaymentMethod.Stripe ? 'text-blue-500' : 'text-amber-500'}`}
                >
                  {data.paymentMethod === PaymentMethod.Stripe ? 'Stripe' : 'COD'}
                </div>
              }
            </div>
          )}
        />
        <Column
          alignHeader={'center'}
          header='Paid at'
          body={(data: IOrderReturn) =>
            data.paidAt ? (
              <div className={`text-center flex flex-col items-center ${data.deletedAt && 'line-through opacity-50'}`}>
                <div className='text-center'>{ConvertTimeString(data.paidAt)} </div>
                <div className='text-center'>{ConvertDateString(data.paidAt)}</div>
              </div>
            ) : (
              <div className={` text-center text-red-500`}>No data</div>
            )
          }
        />
        <Column
          alignHeader={'center'}
          header='Created at'
          body={(data: IOrderReturn) => (
            <div className={`text-center flex flex-col items-center ${data.deletedAt && 'line-through opacity-50'}`}>
              <div className='text-center'>{ConvertTimeString(data.createdAt)} </div>
              <div className='text-center'>{ConvertDateString(data.createdAt)}</div>
            </div>
          )}
        />
        <Column
          alignHeader={'center'}
          header='Action'
          body={(data: IOrderReturn) => (
            <div className='flex items-center justify-center'>
              <Button
                type='button'
                rounded
                text
                className='w-10 h-10 p-0 flex items-center justify-center ring-0'
                onClick={(e) => {
                  setSelectedOrder(data)
                  if (dropdownControlRef.current) {
                    dropdownControlRef.current.toggle(e)
                  }
                }}
              >
                <div className='text-2xl text-center'>{icons.list}</div>
              </Button>
              {dropdownControlRef && (
                <OverlayPanel className='drop-shadow-md p-2' ref={dropdownControlRef}>
                  {selectedOrder &&
                    (selectedOrder.deletedAt !== null ? (
                      <Button
                        text
                        className='ring-0 px-3 py-1 flex items-center gap-2 text-green-500 select-none hover:cursor-pointer w-full'
                        onClick={(e) => handleRestore(e)}
                      >
                        {icons.restore} Restore
                      </Button>
                    ) : (
                      <Button
                        text
                        className='ring-0 px-3 py-1 flex items-center gap-2 text-red-500 select-none hover:cursor-pointer w-full'
                        onClick={deleteConfirm}
                      >
                        {icons.delete} Delete
                      </Button>
                    ))}

                  {selectedOrder &&
                    (selectedOrder.deletedAt !== null ? (
                      <Button
                        text
                        className='ring-0 px-3 py-1 text-primary select-none hover:cursor-pointer w-full  flex items-center gap-2'
                        disabled={selectedOrder.deletedAt !== null}
                      >
                        {icons.search} Detail
                      </Button>
                    ) : (
                      <Link to={`/admin/order-detail/${selectedOrder.id}`}>
                        <Button
                          text
                          className='ring-0 px-3 py-1 text-primary select-none hover:cursor-pointer w-full  flex items-center gap-2'
                          disabled={selectedOrder.deletedAt !== null}
                        >
                          {icons.search} Detail
                        </Button>
                      </Link>
                    ))}
                </OverlayPanel>
              )}
            </div>
          )}
        />
      </DataTable>
    </div>
  )
}
