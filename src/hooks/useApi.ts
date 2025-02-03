import { useState } from 'react'

import { AxiosError } from 'axios'

import { ErrorResponseData } from '@/interfaces'

import { errorResponseCases } from '@/utils/common'

import { useBoolean } from './useBoolean'

type UseApiRequestReturn<T> = {
  loading: boolean
  errorMessage: string
  showSuccess: boolean
  callApi: (apiFunc: () => Promise<T>) => Promise<void>
}

export const useApi = <T>(): UseApiRequestReturn<T> => {
  const [errorMessage, setErrorMessage] = useState('')

  const { value: loading, setTrue: setLoading, setFalse: setUnloading } = useBoolean(false)

  const { value: showSuccess, setTrue: setShowSuccess, setFalse: setUnShowSuccess } = useBoolean(false)

  const callApi = async (apiFunc: () => Promise<T>) => {
    setLoading()
    setErrorMessage('')
    try {
      await apiFunc()
      setShowSuccess()
    } catch (error: unknown) {
      const axiosError = error as AxiosError<ErrorResponseData>
      const errorCode = axiosError.response?.data?.errorCode
      setErrorMessage(
        errorCode && errorResponseCases[errorCode] ? errorResponseCases[errorCode] : errorResponseCases['All']
      )
    } finally {
      setUnloading()
      setTimeout(() => {
        setUnShowSuccess()
      }, 3000)
    }
  }

  return { loading, errorMessage, showSuccess, callApi }
}
