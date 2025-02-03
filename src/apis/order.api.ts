import { instance as axiosClient } from '@/configs'
import { IQuery, IUpdateOrder } from '@/interfaces'

export const orderApi = {
  getOrders: async (params: IQuery) => {
    return await axiosClient.get(`/order/all/`, { params })
  },
  getOrder: async (id: string) => {
    return await axiosClient.get(`/order/${id}`)
  },
  updateOrder: async (id: string, body: IUpdateOrder) => {
    return await axiosClient.patch(`/order/update/${id}`, body)
  },
  cancelOrder: async (id: string) => {
    return await axiosClient.patch(`/order/cancel/${id}`)
  },
  deleteOrder: async (id: string) => {
    return await axiosClient.delete(`/order/delete/${id}`)
  },
  restoreOrder: async (id: string) => {
    return await axiosClient.patch(`/order/restore/${id}`)
  }
}
