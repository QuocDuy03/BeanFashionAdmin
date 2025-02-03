import { Card } from 'primereact/card'
import { Avatar } from 'primereact/avatar'
import { Column } from 'primereact/column'
import { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable'

import { useApi } from '@/hooks'
import { dashboardApi } from '@/apis'
import annonAvatar from '@/assets/images/annonAvatar.png'
import { ICustomersStatisticResponse } from '@/interfaces'

export const CustomerStat = () => {
  const { loading, callApi } = useApi<void>()

  const [customersStat, setcustomersStat] = useState<ICustomersStatisticResponse[]>([])

  const getChartOrderData = async () => {
    try {
      callApi(async () => {
        const { data } = await dashboardApi.getCustomersStat()
        setcustomersStat(data)
      })
    } catch (error) {
      console.error(error)
    }
  }

  const avatarBodyTemplate = (rowData: ICustomersStatisticResponse) => (
    <Avatar image={rowData.avatar ?? annonAvatar} shape='circle' className='mr-2' />
  )

  const nameBodyTemplate = (rowData: ICustomersStatisticResponse) => (
    <span className='font-normal text-slate-800'>{rowData.fullName}</span>
  )

  const emailBodyTemplate = (rowData: ICustomersStatisticResponse) => (
    <span className='font-norma text-slate-800 text-sm'>{rowData.email}</span>
  )

  const totalSpentBodyTemplate = (rowData: ICustomersStatisticResponse) => (
    <span className='font-normal text-slate-800'>{rowData.totalspent.toLocaleString('de-DE')}</span>
  )

  useEffect(() => {
    getChartOrderData()
  }, [])

  return (
    <Card
      title='Top Customers'
      className='shadow-none border border-gray-200'
      pt={{
        root: {
          className: 'shadow-none'
        },
        title: {
          className: 'text-slate-950 py-3'
        },
        body: {
          className: 'pb-0'
        }
      }}
    >
      <DataTable value={customersStat} paginator={customersStat.length > 5} rows={5} loading={loading}>
        <Column header='Avatar' body={avatarBodyTemplate} className='w-[10%]' />
        <Column header='Name' body={nameBodyTemplate} className='w-[30%]' />
        <Column header='Email' body={emailBodyTemplate} className='w-[35%]' />
        <Column header='Spent' body={totalSpentBodyTemplate} className='w-[15%]' />
      </DataTable>
    </Card>
  )
}
