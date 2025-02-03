import { createBrowserRouter } from 'react-router-dom'

import { PATH } from '@/utils'
import { DefaultLayout } from '@/layouts'
import {
  ManageCategory,
  CreateBlog,
  BlogsList,
  BlogDetail,
  UpdateBlog,
  Login,
  NotFound,
  Product,
  Discount,
  Orders,
  OrderDetail,
  Dashboard
} from '@/pages'

import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute role='admin'>
        <DefaultLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: PATH.dashboard,
        element: <Dashboard />
      },
      {
        path: PATH.orders,
        element: <Orders />
      },
      {
        path: PATH.orderDetail,
        element: <OrderDetail />
      },
      {
        path: PATH.manageCategory,
        element: <ManageCategory />
      },
      {
        path: PATH.blogCreate,
        element: <CreateBlog />
      },
      {
        path: PATH.blogList,
        element: <BlogsList />
      },
      {
        path: PATH.blogDetail,
        element: <BlogDetail />
      },
      {
        path: PATH.blogUpdate,
        element: <UpdateBlog />
      },
      {
        path: PATH.product,
        element: <Product />
      },
      {
        path: PATH.discount,
        element: <Discount />
      }
    ]
  },
  {
    path: PATH.login,
    element: <Login />
  },
  {
    path: PATH.notFound,
    element: <NotFound />
  }
])
