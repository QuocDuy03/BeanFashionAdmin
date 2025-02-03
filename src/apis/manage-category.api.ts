import { instance as axiosClient } from '@/configs'
import { ICategoryInput } from '@/interfaces'

export const manageCategoryApi = {
    create: async (categoryData: ICategoryInput) => {
        return axiosClient.post('/category/create', categoryData)
    },
    findAll: async () => {
        return axiosClient.get('/category/all')
    },
    findOne: async (id: string) => {
        return axiosClient.get(`/category/${id}`)
    },
    update: async (id: string, categoryData: ICategoryInput) => {
        return axiosClient.patch(`/category/${id}`, { categoryData })
    },
    delete: async (id: string) => {
        return axiosClient.delete(`/category/delete/${id}`)
    },
    removeMultiple: async (ids: string[]) => {
        return axiosClient.delete('/category/bulk-delete', {
            data: ids
        })
    }
}