import { Card } from 'primereact/card'
import { Image } from 'primereact/image'
import { Column } from 'primereact/column'
import { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'

import { useApi } from '@/hooks'
import { dashboardApi } from '@/apis'
import { IProductsStatisticResponse } from '@/interfaces'

export const ProductStat = () => {
  const { loading, callApi } = useApi<void>()

  const [productsStat, setproductsStat] = useState<IProductsStatisticResponse[]>([])

  const getChartOrderData = async () => {
    try {
      await callApi(async () => {
        const { data } = await dashboardApi.getProductsStat()
        setproductsStat(data)
      })
    } catch (error) {
      console.error(error)
    }
  }

  const categoryMap: { [key: string]: string } = {
    nam: 'Man',
    nữ: 'Woman',
    'trẻ em': 'Child'
  }

  const avatarBodyTemplate = (rowData: IProductsStatisticResponse) => (
    <Image src={rowData.imgUrl} alt={rowData.name} width='58' />
  )

  const nameBodyTemplate = (rowData: IProductsStatisticResponse) => (
    <span className='font-normal text-slate-800'>{rowData.name}</span>
  )

  const priceBodyTemplate = (rowData: IProductsStatisticResponse) => (
    <span className='font-normal text-slate-800'>{rowData.price.toLocaleString('de-DE')}</span>
  )

  const categoryBodyTemplate = (rowData: IProductsStatisticResponse) => (
    <span className='text-slate-800'>{categoryMap[rowData.category]}</span>
  )

  const quantitySoldBodyTemplate = (rowData: IProductsStatisticResponse) => (
    <span className='text-slate-800'>{rowData.sold}</span>
  )

  useEffect(() => {
    getChartOrderData()
  }, [])

  return (
    <Card
      title='Top Products'
      className='shadow-none border border-gray-200'
      pt={{
        root: {
          className: 'shadow-none p-0'
        },
        title: {
          className: 'text-slate-950 py-3'
        },
        body: {
          className: 'pb-0'
        }
      }}
    >
      <DataTable value={productsStat} paginator rows={5} loading={loading}>
        <Column header='Image' body={avatarBodyTemplate} className='w-[10%]' />
        <Column header='Name' body={nameBodyTemplate} className='w-[30%]' />
        <Column header='Price' body={priceBodyTemplate} className='w-[20%]' />
        <Column header='Category' body={categoryBodyTemplate} className='w-[20%]' />
        <Column header='Sold' body={quantitySoldBodyTemplate} className='w-[5%]' />
      </DataTable>
    </Card>
  )
}
