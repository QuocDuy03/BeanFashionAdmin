import { ReactNode } from 'react'

export interface IToastFunctionOptions {
  severity?: 'info' | 'success' | 'warn' | 'error' | 'secondary' | 'contrast' | undefined
  summary?: ReactNode
  detail?: ReactNode
  life?: number
}
