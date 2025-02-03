import { ICategory } from "./ICategory.interface";

export interface ICreateProductDetail {
    id?: string,
    size: string,
    colorName: string,
    color: string,
    imgUrl: string,
    stock: number,
}
export interface ICreateProduct {
    name: string,
    price: number,
    discount: number,
    description: string,
    categoryId: string,
    productDetails: ICreateProductDetail[]
}

export interface IInputProduct {
    name: string,
    price: number,
    discount?: number,
    description: string,
    numberOfColor: string
    categoryType: {value: string},
    colorNames: string[],
    colors: (string | undefined)[],
    sizes: string[],
    stocks: number[],
    imgUrls: (string | undefined)[],
    stockAll?: number
}

export interface IProductDetail {
    id: string,
    size: string,
    colorName: string,
    color: string,
    imgUrl: string,
    stock: number
}
export interface IProduct {  
    id: string; 
    name: string;
    description: string;
    price: number;
    category: ICategory;
    slug: string;
    discount: number;
    createdAt: Date;
    updatedAt: Date;
    productDetails: IProductDetail[];
}