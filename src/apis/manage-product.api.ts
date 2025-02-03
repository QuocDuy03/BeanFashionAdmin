import { instance as axiosClient } from '@/configs'
import { ICreateProduct } from '@/interfaces'

export const productApi = {
    createProduct: async (productData: ICreateProduct) => {
        return await axiosClient.post('/product', productData)
    },
    findAllProducts: async () => {
        return await axiosClient.get('/product')
    },
    findOneProduct: async (productId: string) => {
        return await axiosClient.get(`/product/${productId}`)
    },
    updateProduct: async (productId: string, productData: ICreateProduct) => {
        return await axiosClient.put(`/product/${productId}`, productData)
    },
    deleteProduct: async (productId: string) => {
        return await axiosClient.delete(`/product/${productId}`)
    }
}