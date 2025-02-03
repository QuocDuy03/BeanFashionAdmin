import { Card } from 'primereact/card'
import { Chart } from 'primereact/chart'
import { Dropdown } from 'primereact/dropdown'
import { Skeleton } from 'primereact/skeleton'
import { memo, useEffect, useState } from 'react'

import { useApi } from '@/hooks'
import { dashboardApi } from '@/apis'
import { IBarChartData } from '@/interfaces'
import { BAR_CHART_OPTIONS, SORT_OPTIONS } from '@/utils' 

export const RevenueBarChart = memo(() => {
  const { loading, callApi } = useApi<void>()

  const [filterType, setFilterType] = useState('thisWeek')

  const [chartOrderData, setChartOrderData] = useState<IBarChartData>()

  const getChartOrderData = async () => {
    try {
      await callApi(async () => {
        const { data } = await dashboardApi.getChartOrder(filterType)
        setChartOrderData({
          labels: data.labels,
          datasets: [
            {
              label: 'Revenue',
              backgroundColor: '#6366f1',
              borderColor: '#6366f1',
              barThickness: 20,
              borderRadius: 20,
              data: data.revenue
            },
            {
              label: 'Profit',
              backgroundColor: '#bcbdf9',
              borderColor: '#bcbdf9',
              barThickness: 20,
              borderRadius: 20,
              data: data.profit
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
  }, [filterType])

  return (
    <div>
      <Card
        title={
          <div className='flex items-center justify-between'>
            <h5 className='text-slate-950'>Revenue Overview</h5>
            <Dropdown
              value={SORT_OPTIONS.find((option) => option.code === filterType)}
              options={SORT_OPTIONS}
              optionLabel='name'
              placeholder='Select a type'
              className='!text-slate-950'
              onChange={(e) => setFilterType(e.value.code)}
            />
          </div>
        }
        pt={{
          root: {
            className: 'shadow-none'
          }
        }}
      >
        <div className='overflow-x-auto'>
          {loading ? (
            <Skeleton height='23.3rem'></Skeleton>
          ) : (
            <div style={{ minWidth: '1200px' }}>
              <Chart type='bar' data={chartOrderData} options={BAR_CHART_OPTIONS}></Chart>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
})
