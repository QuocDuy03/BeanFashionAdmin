import { Card } from 'primereact/card'
import { useEffect, useState } from 'react'

import { useApi } from '@/hooks'
import { dashboardApi } from '@/apis'
import { Skeleton } from 'primereact/skeleton'
import { IQuantityStatisticResponse } from '@/interfaces'

export const CardWrapper = () => {
  const { loading, callApi } = useApi<void>()

  const [statisticQuantityData, setStatisticQuantityData] = useState<IQuantityStatisticResponse[]>([])

  const getQuantityStat = async () => {
    try {
      callApi(async () => {
        const { data } = await dashboardApi.getQuantiyStatistic()
        setStatisticQuantityData(data)
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getQuantityStat()
  }, [])

  return (
    <>
      {loading ? (
        Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} height='6rem'></Skeleton>)
      ) : (
        <>
          {statisticQuantityData.map((data) => (
            <Card
              key={data.type}
              title={data.title}
              className='text-base'
              pt={{
                root: {
                  className: 'shadow-none'
                },
                title: {
                  className: 'text-slate-950 text-base font-medium'
                },
                content: {
                  className: 'p-0'
                }
              }}
            >
              <span>{data.quantity} </span>
            </Card>
          ))}
        </>
      )}
    </>
  )
}
