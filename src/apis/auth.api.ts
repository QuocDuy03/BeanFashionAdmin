import { instance as axiosClient } from '@/configs'
import { ILoginData } from '@/interfaces'

export const authApi = {
  login: async (userData: ILoginData) => {
    return axiosClient.post('/auth/login', userData)
  },

  logout: async () => {
    return axiosClient.delete('/auth/logout')
  }
}
