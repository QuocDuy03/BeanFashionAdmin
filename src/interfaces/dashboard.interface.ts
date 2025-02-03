export interface IQuantityStatisticResponse {
  title: string
  type: string
  quantity: number
}

export interface IChartOrderResponse {
  labels: string[]
  revenue: number[]
  profit: number[]
}

export interface ICustomersStatisticResponse {
  id: string
  fullName: string
  email: string
  avatar: string | null
  totalspent: number
}

export interface IProductsStatisticResponse {
  slug: string
  name: string
  imgUrl: string
  price: number
  category: string
  sold: string
}
