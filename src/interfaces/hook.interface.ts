import { Dispatch, SetStateAction } from 'react'

export interface IUseBooleanReturn {
  value: boolean
  setValue: Dispatch<SetStateAction<boolean>>
  setTrue: () => void
  setFalse: () => void
  toggle: () => void
}
