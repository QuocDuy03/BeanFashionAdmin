import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'

import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

import { icons } from '@/utils'
type SearchProps = {
  placeholder?: string
  floatLabel?: boolean
  size?: 'large' | 'medium' | 'small'
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  control?: any
  errors?: any
  disabled?: boolean
}
export const Search: React.FC<SearchProps> = ({
  placeholder = 'Search',
  size = 'large',
  className,
  control,
  errors,
  disabled
}) => {
  const [isInvalid, setIsInvalid] = useState(false)

  const inputSizes = {
    small: 'p-inputtext-sm',
    medium: '',
    large: 'p-inputtext-lg'
  }
  const inputCommonProps = {
    placeholder,
    id: 'searchValue',
    disabled
  }
  const inputClassNames = `py-2 
  ${className} 
  ${inputSizes[size]} 
  `

  useEffect(() => {
    setIsInvalid(!!errors?.['searchValue'])
  }, [errors])

  return (
    <Controller
      name={'searchValue'}
      control={control}
      render={({ field }) => (
        <div className={`relative ${className}`}>
          <Button
            size='small'
            className='absolute w-10 h-10 p-2 text-2xl text-gray-500 ring-0 left-1'
            type='submit'
            rounded
            text
            icon={icons.search}
          ></Button>
          <InputText
            {...inputCommonProps}
            size={'small'}
            className={`rounded-full pl-10  ${inputClassNames}`}
            {...field}
            invalid={isInvalid}
          />
        </div>
      )}
    />
  )
}
