import { IProduct } from './Product.interface'

export interface IDiscount {
  id: string
  discountValue: number
  timeRange: '0h-6h' | '6h-12h' | '12h-18h' | '18h-24h'
  date: Date
  product: Omit<IProduct, 'productDetails'>
}

export interface IDiscountInput {
  productId: string
  discountValue: number | null
  timeRange: '0h-6h' | '6h-12h' | '12h-18h' | '18h-24h'
  date: Date
}
