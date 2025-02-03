import { IProduct } from "@/interfaces";

export const sortFunctions = {
    'name-asc': (products: IProduct[]) => products.sort((a, b) => a.name.localeCompare(b.name)),
    'name-desc': (products: IProduct[]) => products.sort((a, b) => b.name.localeCompare(a.name)),
    'price-asc': (products: IProduct[]) => products.sort((a, b) => a.price - b.price),
    'price-desc': (products: IProduct[]) => products.sort((a, b) => b.price - a.price),
    'date-asc': (products: IProduct[]) =>
        products.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    'date-desc': (products: IProduct[]) =>
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
};