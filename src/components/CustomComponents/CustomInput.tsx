/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Controller, ControllerRenderProps } from 'react-hook-form'
import { InputNumber } from 'primereact/inputnumber'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'

type CustomInputProps = {
  name: string
  placeholder?: string
  control?: any
  errors?: any
  label?: string
  floatLabel?: boolean
  size?: 'large' | 'medium' | 'small'
  className?: string
  type?: 'text' | 'password' | 'number' | 'select' | 'calendar'
  onChange?: (e: any) => void
  disabled?: boolean
  status?: 'error' | 'warning'
  options?: any[]
  optionLabel?: string
  optionValue?: string
}

export const Input: React.FC<CustomInputProps> = ({
  name,
  placeholder,
  control,
  errors,
  label,
  floatLabel = false,
  size = 'large',
  className,
  type = 'text',
  onChange,
  disabled = false,
  status,
  options = [],
  optionValue,
  optionLabel
}) => {
  const isInvalid = status === 'error' || !!errors?.[name]
  const inputSizes = {
    small: 'p-inputtext-sm',
    medium: '',
    large: 'p-inputtext-lg'
  }
  const inputClassNames = `py-2 
  ${className} 
  ${inputSizes[size]} 
  ${isInvalid && 'p-invalid'}
  `

  const inputCommonProps = {
    placeholder,
    id: name,
    name,
    disabled,
    invalid: isInvalid
  }

  const getInputElement = (field?: ControllerRenderProps) => {
    const elementProps = { ...inputCommonProps, ...(field || { onChange: onChange }) }
    switch (type) {
      case 'number':
        return field ? (
          <InputNumber
            {...inputCommonProps}
            ref={field.ref}
            value={field.value}
            onBlur={field.onBlur}
            onValueChange={(e) => field.onChange(e)}
            inputClassName={inputClassNames}
            className={inputClassNames.replace('py-2', '')}
            useGrouping={false}
          />
        ) : (
          <InputNumber
            {...inputCommonProps}
            onValueChange={onChange}
            inputClassName={inputClassNames}
            className={inputClassNames}
            useGrouping={false}
          />
        )
      case 'password':
        return <Password {...elementProps} inputClassName={inputClassNames} feedback={false} toggleMask />
      case 'select':
        return (
          <Dropdown
            {...elementProps}
            options={options}
            className={inputClassNames}
            optionValue={optionValue}
            optionLabel={optionLabel}
            filter
          />
        )
      case 'calendar':
        return (
          <Calendar
            {...elementProps}
            className={inputClassNames}
            dateFormat='dd/mm/yy'
            showIcon
          />
        )
      case 'text':
      default:
        return <InputText {...elementProps} className={inputClassNames} />
    }
  }

  const renderErrorMessage = () => (errors?.[name] ? <div className='p-error'>{errors[name].message}</div> : null)

  return control ? (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div>
          {
            <span className={floatLabel ? 'p-float-label' : undefined}>
              {floatLabel && getInputElement(field)}
              <label htmlFor={name} className={fieldState.invalid ? 'p-error' : ''}>
                {label}
              </label>
              {!floatLabel && getInputElement(field)}
            </span>
          }
          {renderErrorMessage()}
        </div>
      )}
    />
  ) : (
    getInputElement()
  )
}
