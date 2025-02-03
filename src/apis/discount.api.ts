import { instance as axiosClient } from '@/configs'
import { IDiscountInput } from '@/interfaces'

export const discountApi = {
  create: async (discountData: IDiscountInput) => {
    return axiosClient.post('/discount', discountData)
  },
  update: async (id: string, discountData: IDiscountInput) => {
    return axiosClient.patch(`/discount/${id}`, discountData)
  },
  findAll: async () => {
    return axiosClient.get(`/discount`)
  },
  delete: async (id: string) => {
    return axiosClient.delete(`/discount/delete/${id}`)
  },
  removeMultiple: async (ids: string[]) => {
    return axiosClient.delete('/discount/bulk-delete', {
      data: ids
    })
  }
}
