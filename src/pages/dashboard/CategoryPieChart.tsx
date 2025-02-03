import { Card } from 'primereact/card'
import { Chart } from 'primereact/chart'
import { Skeleton } from 'primereact/skeleton'
import { useEffect, useState, memo } from 'react'

import { useApi } from '@/hooks'
import { dashboardApi } from '@/apis'
import { DOUGHTNUT_CHART_OPTIONS } from '@/utils'
import { IDoughtnutChartData } from '@/interfaces'

export const CategoryPieChart = memo(() => {
  const { loading, callApi } = useApi<void>()
  
  const [chartCategoryData, setChartCategoryData] = useState<IDoughtnutChartData>()

  const getChartOrderData = async () => {
    try {
      await callApi(async () => {
        const { data } = await dashboardApi.getChartCategory()
        setChartCategoryData({
          labels: data.labels,
          datasets: [
            {
              data: data.data,
              backgroundColor: ['#3b4ca5', '#7888ef', '#d8dbfa'],
              hoverBackgroundColor: ['#31408b', '#6971a7', '#7f84aa']
            }
          ]
        })
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getChartOrderData()
  }, [])

  return (
    <div>
      <Card
        title='Sales by Category'
        pt={{
          root: {
            className: 'shadow-none'
          },
          title: {
            className: 'text-slate-950 py-3'
          }
        }}
      >
        {loading ? (
          <div className='flex justify-center items-center'>
            <Skeleton shape='circle' size='23.5rem' className='mr-2'></Skeleton>
          </div>
        ) : (
          <Chart type='doughnut' data={chartCategoryData} options={DOUGHTNUT_CHART_OPTIONS}></Chart>
        )}
      </Card>
    </div>
  )
})
