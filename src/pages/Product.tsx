import { useApi, useBoolean } from "@/hooks"
import { ICategory } from "@/interfaces"
import { manageCategoryApi } from "@/apis"
import { ProductTable, ProductHeader } from "@/components"

import { useEffect, useState } from "react"

export const Product = () => {
  const { callApi: callApiGetCategory } = useApi<void>()
  const [categories, setCategories] = useState<ICategory[]>([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('default')
  const { value: isProductChange, toggle: toggleProductChange } = useBoolean(false);

  const getAllCategories = async () => {
    callApiGetCategory(async () => {
        const { data } = await manageCategoryApi.findAll()
        setCategories(data)
    })
  }
useEffect(() => {
    getAllCategories()
},[])

  return (
    <div className='w-full h-full'>
      <ProductHeader category={categories} setQuery={setQuery} setFilter={setFilter} toggleProductChange={toggleProductChange}/>
      <div className='h-full w-[95%] bg-white m-auto mt-4 rounded-lg'>      
        <ProductTable category={categories} query={query} filter={filter} isProductChange={isProductChange} toggleProductChange={toggleProductChange}/>
      </div>
    </div>
  )
}
