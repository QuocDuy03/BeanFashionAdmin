import { ProductStat } from './ProductStat'
import { CardWrapper } from './CardWrapper'
import { CustomerStat } from './CustomerStat'
import { RevenueBarChart } from './RevenueBarChart'
import { CategoryPieChart } from './CategoryPieChart'

export const Dashboard = () => {
  return (
    <section className='px-10'>
      <div className='grid md:grid-cols-2  xl:grid-cols-4 gap-4'>
        <CardWrapper />
      </div>
      <div className='grid xl:grid-cols-10 gap-4 py-4'>
        <div className='xl:col-span-7'>
          <RevenueBarChart />
        </div>

        <div className='xl:col-span-3'>
          <CategoryPieChart />
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <CustomerStat />
        <ProductStat />
      </div>
    </section>
  )
}
