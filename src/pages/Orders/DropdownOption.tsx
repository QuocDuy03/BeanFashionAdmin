import { FilterOptions, icons, SortOptions } from '@/utils'

type SortType = {
  value: string
  label: string
  icon: JSX.Element
}

export const optionTemplate = (option: SortType) => {
  return (
    <div className='flex align-items-center'>
      <div className='flex items-center gap-2'>
        {option.label}
        {option.icon}
      </div>
    </div>
  )
}
export const sortOptionTemplate = (option: SortType) => {
  return optionTemplate(option)
}
export const selectedOptionTemplate = (option: SortType) => {
  return optionTemplate(option)
}
export const sortOptions = [
  {
    value: SortOptions.DateDecrease,
    label: 'Date: ',
    icon: icons.downArrow
  },
  {
    value: SortOptions.DateIncrease,
    label: 'Date: ',
    icon: icons.upArrow
  },
  {
    value: SortOptions.PriceDecrease,
    label: 'Price: ',
    icon: icons.downArrow
  },
  {
    value: SortOptions.PriceIncrease,
    label: 'Price: ',
    icon: icons.upArrow
  }
]
export const filterOptions = [
  {
    value: FilterOptions.Delivered,
    label: FilterOptions.Delivered
  },
  {
    value: FilterOptions.Delivering,
    label: FilterOptions.Delivering
  },
  {
    value: FilterOptions.Confirmed,
    label: FilterOptions.Confirmed
  },

  {
    value: FilterOptions.Pending,
    label: FilterOptions.Pending
  },
  {
    value: FilterOptions.Cancelled,
    label: FilterOptions.Cancelled
  },
  {
    value: FilterOptions.None,
    label: FilterOptions.None
  }
]
