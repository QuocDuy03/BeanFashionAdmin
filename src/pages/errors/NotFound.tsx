import { Link } from 'react-router-dom'

import { PATH } from '@/utils'

export const NotFound = () => {
  return (
    <section className='bg-white dark:bg-gray-900 flex h-screen'>
      <div className='py-8 px-4 m-auto w-full'>
        <div className='mx-auto text-center'>
          <h1 className='mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary'>404</h1>
          <p className='mb-4 text-3xl tracking-tight font-bold text-primary md:text-4xl dark:text-white'>Not found</p>
          <p className='mb-4 text-lg font-light text-gray-800 dark:text-gray-400'>
            Sorry, we can't find that page. You'll find lots to explore on the home page.
          </p>
          <Link
            to={PATH.dashboard}
            className='inline-flex text-white bg-primary hover:bg-primary-hover focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4'
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  )
}
