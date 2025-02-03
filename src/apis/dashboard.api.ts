import { instance as axiosClient } from '@/configs'
import {
  IChartOrderResponse,
  ICustomersStatisticResponse,
  IProductsStatisticResponse,
  IQuantityStatisticResponse
} from '@/interfaces'

export const dashboardApi = {
  getQuantiyStatistic: async () => {
    return axiosClient.get<IQuantityStatisticResponse[]>('/dashboard/quantity-stat')
  },

  getChartOrder: async (filterType: string) => {
    return axiosClient.get<IChartOrderResponse>(`/dashboard/chart-order/${filterType}`)
  },

  getChartCategory: async () => {
    return axiosClient.get('/dashboard/chart-category')
  },

  getCustomersStat: async () => {
    return axiosClient.get<ICustomersStatisticResponse[]>('/dashboard/customers-stat')
  },

  getProductsStat: async () => {
    return axiosClient.get<IProductsStatisticResponse[]>('/dashboard/products-stat')
  }
}
