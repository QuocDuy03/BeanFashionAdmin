import { SetStateAction, useEffect, useState } from "react";
import { Paginator } from 'primereact/paginator';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from "primereact/progressspinner";

import { productApi } from "@/apis";
import { useApi } from "@/hooks";
import { ICategory, IProduct } from "@/interfaces";
import { sortFunctions } from "@/utils";

import { ProductRow } from "./ProductRow";

type ProductTableProps = {
    category: ICategory[];
    query: string;
    filter: string;
    toggleProductChange: () => void;
    isProductChange: boolean;
}

const bgColors = {
    'IN STOCK': 'bg-green-300',
    'LOW STOCK': 'bg-amber-200',
    'OUT OF STOCK': 'bg-red-200'
}

export const ProductTable: React.FC<ProductTableProps> = ({category, query, filter, isProductChange, toggleProductChange}) => {
    const [first, setFirst] = useState(0);
    const onPageChange = (event: { first: SetStateAction<number>}) => {
        setFirst(event.first);
    };

    const { loading, callApi: callApiManageProduct } = useApi<void>()
    const [products, setProducts] = useState<IProduct[]>([])
    const getAllProducts = async () => {
        callApiManageProduct(async () => {
            const { data } = await productApi.findAllProducts()
            setProducts(data)
        })
    }
    useEffect(() => {
        getAllProducts()
    }, [isProductChange])
    
    const filterProducts = () => {
        const sortProducts = (products: IProduct[]) => {
            const sortFunction = sortFunctions[filter as keyof typeof sortFunctions];
            return sortFunction ? sortFunction(products) : products;
        };
    
        return sortProducts([...products]).filter((product: IProduct) =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );
    };

    const checkStock = (product: IProduct) => {
        const stock = product.productDetails.reduce((acc, detail) => acc + detail.stock, 0)
        return stock === 0 ? 'OUT OF STOCK' : stock < 100 ? 'LOW STOCK' : 'IN STOCK'
    }
  return (
    <div className="h-full w-full">
        <DataTable 
            value={Array.isArray(products) && filterProducts().length > 0 ? filterProducts() .slice(first, first + 6) : []} 
            className='text-center w-full' dataKey='id'
            emptyMessage={
                loading ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <ProgressSpinner />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <p className="text-lg font-semibold">No Products Found</p>
                        <p className="text-sm">Try adjusting your search or filter criteria.</p>
                    </div>
                )
            }
        >
            <Column 
                className="w-[8%]"
                alignHeader={'center'}
                header='Name'
                headerStyle={{
                    fontSize: '15px',
                    fontWeight: 'bold'
                }}
                body={(rowData: IProduct) => (
                    <div className='text-sm font-semibold h-[58px] overflow-hidden'>
                        {rowData.name}
                    </div>
                )}
            />
            <Column 
                className="w-[8%]"
                alignHeader={'center'}
                header='Image'
                headerStyle={{
                    fontSize: '15px',
                    fontWeight: 'bold'
                }}
                body={(rowData: IProduct) => (
                    <img 
                        src={rowData.productDetails[0].imgUrl} 
                        alt={rowData.name} 
                        className='w-[70px] h-[70px] object-cover rounded-sm m-auto'
                    />
                )}
            />
            <Column                 
                className="w-[10%]"
                alignHeader={'center'}
                header='Category'
                headerStyle={{
                    fontSize: '15px',
                    fontWeight: 'bold'
                }}
                body={(rowData: IProduct) => (
                    <div className='text-sm font-semibold h-[58px] overflow-hidden flex justify-center items-center'>
                        {rowData.category.gender.charAt(0).toUpperCase() + rowData.category.gender.slice(1) + ' - ' + rowData.category.type.charAt(0).toUpperCase() + rowData.category.type.slice(1)}
                    </div>
                )}
            />
            <Column
                className="w-[40%]"
                alignHeader={'center'}
                header='Description'
                headerStyle={{
                    fontSize: '15px',
                    fontWeight: 'bold'
                }}
                body={(rowData: IProduct) => (
                    <div className='text-sm h-[58px] overflow-hidden'>
                        <span dangerouslySetInnerHTML={{ __html: rowData.description }}></span>
                    </div>
                )}
            />
            <Column
                className="w-[8%]"
                alignHeader={'center'}
                header='Price'
                headerStyle={{
                    fontSize: '15px',
                    fontWeight: 'bold'
                }}
                body={(rowData: IProduct) => (
                    <div className='text-sm font-semibold h-[58px] overflow-hidden flex justify-center items-center'>
                        {rowData.price.toLocaleString('de-DE')}₫
                    </div>
                )}
            />
            <Column
                className="w-[8%]"
                alignHeader={'center'}
                header='Discount'
                headerStyle={{
                    fontSize: '15px',
                    fontWeight: 'bold'
                }}
                body={(rowData: IProduct) => (
                    <div className='text-sm font-semibold h-[58px] overflow-hidden flex justify-center items-center'>
                        {rowData.discount + '%'}
                    </div>
                )}
            />
            <Column
                className="w-[8%]"
                alignHeader={'center'}
                header='Stock'
                headerStyle={{
                    fontSize: '15px',
                    fontWeight: 'bold'
                }}
                body={(rowData: IProduct) => (
                    <div className="text-sm font-semibold h-[58px] overflow-hidden flex justify-center items-center" >
                        <div className={`w-fit h-fit rounded-md ${bgColors[checkStock(rowData)]} px-2 py-1`}>
                            {checkStock(rowData)}
                        </div>
                    </div>
                )}
            />
            <Column
                className="w-[8%]"
                alignHeader={'center'}
                header='Updated At'
                headerStyle={{
                    fontSize: '15px',
                    fontWeight: 'bold'
                }}
                body={(rowData: IProduct) => (
                    <div className='text-sm font-semibold h-[58px] overflow-hidden flex justify-center items-center text-center'>
                        {new Date(rowData.updatedAt).toLocaleString()}
                    </div>
                )}
            />
            <Column
                className="w-[5%]"
                alignHeader={'center'}
                header='Action'
                headerStyle={{
                    fontSize: '15px',
                    fontWeight: 'bold'
                }}
                body={(rowData: IProduct) => (
                    <div className="flex justify-center items-center">
                        <ProductRow 
                            productInfo={rowData} 
                            category={category} 
                            toggleProductChange={toggleProductChange} 
                        />
                    </div>
                )}
            />
        </DataTable>
        <Paginator first={first} rows={6} totalRecords={filterProducts().length} onPageChange={onPageChange}/>
    </div>
  )
}