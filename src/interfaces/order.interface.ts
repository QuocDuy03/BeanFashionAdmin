import { IAddressReturn } from './address.interface'
import { ICurrentUser } from './auth.interface'
import { OrderStatus, PaymentMethod, PaymentStatus } from '@/utils'

export interface IOrder {
  products: {
    productDetailId: string
    quantity: number
  }[]
  totalPrice: number
  address: IAddressReturn
  paymentMethod: PaymentMethod
  message: string
}
export interface IOrderProduct {
  id: string
  color: string
  colorName: string
  discount: number
  imgUrl: string
  name: string
  price: number
  quantity: number
  size: string
  slug: string
}
export interface IOrderReturn {
  address: IAddressReturn
  id: string
  message: string
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  orderStatus: OrderStatus
  products: IOrderProduct[]
  paidAt: string
  totalPrice: number
  user: ICurrentUser
  createdAt: string
  deletedAt: string
}
export interface IOrderDetailReturn extends IOrderReturn {
  paymentSessionId: string
  paymentInvoiceId: string
  completedAt: string
  deletedAt: string
}
export interface IUpdateOrder {
  paymentStatus?: PaymentStatus
  orderStatus?: OrderStatus
}
