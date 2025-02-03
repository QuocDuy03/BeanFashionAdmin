import { useRef, useEffect, useState } from 'react'
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form';

import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Button as PrimeBtn } from 'primereact/button';
import { Editor, EditorTextChangeEvent } from 'primereact/editor';
import { Dropdown } from 'primereact/dropdown';
import { ColorPicker, ColorPickerChangeEvent } from 'primereact/colorpicker';
import { Sidebar } from 'primereact/sidebar';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Dialog } from "primereact/dialog";

import { productApi } from '@/apis';
import { useBoolean, useApi } from '@/hooks';
import { ICategory, ICreateProductDetail, IInputProduct, IProduct } from '@/interfaces';
import { Input, Button } from '@/components';

import { icons } from '@/utils/icons';
import { schema, sizes } from '@/utils/constants';
import { uploadToCloudinary } from '@/utils/helpers';

import { yupResolver } from '@hookform/resolvers/yup';

type ProductRowProps = {
    productInfo: IProduct;
    toggleProductChange: () => void;
    category: ICategory[];
}

type ControllerType = {
    discount?: number | undefined;
    stockAll?: number | undefined;
    colorNames: string[];
    sizes: string[];
    colors: (string | undefined)[];
    imgUrls: string[];
    stocks: number[];
    name: string;
    price: number;
    description: string;
    categoryType: {
        value: string;
    };
    numberOfColor: string;
}

export const ProductRow: React.FC<ProductRowProps> = ({productInfo, toggleProductChange, category}) => { 
    const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
    const [colorErrorMessage, setColorErrorMessage] = useState<string>('');
    const toast = useRef<Toast>(null);
    const fileUploadReference = useRef<FileUpload>(null);
    const { value: showProductDetail, toggle: toggleShowProductDetail } = useBoolean(false);
    const { value: showConfirmDelete, toggle: toggleShowConfirmDelete, setFalse: hideConfirmDelete } = useBoolean(false);
    const { loading, errorMessage, callApi: callApiManageProduct } = useApi<void>()
    const {value: showStock, setFalse, setTrue} = useBoolean(true);
    const {value: isDisabled, setTrue: setDisabled, setFalse: setEnabled} = useBoolean(true);
    const op = useRef<OverlayPanel>(null);
    const {value: showDialog, setTrue: setShowDialog, setFalse: setHideDialog} = useBoolean(false);
    const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
    const {
        control,
        handleSubmit,
        reset: resetProductForm,
        formState: { errors, isDirty },
        watch,
        setValue
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            colorNames: [],
            sizes: [],
            colors: [],
            imgUrls: [],
            stocks: []
        }
    })
    const handleToggle = () => {
        toggleShowProductDetail();
        resetProductForm();
        setValue('sizes', []);
        setValue('colors', []);
        setValue('imgUrls', []);
        setValue('stocks', []);
    }

    const handleResetForm = () => {
        const colorsArray = [...new Set(productInfo.productDetails.map(detail => detail.color))];
        const sizesArray = [...new Set(productInfo.productDetails.map(detail => detail.size))];
        productInfo.productDetails.forEach((detail) => {
            const sizeIndex = watch('sizes').indexOf(detail.size);
            const colorIndex = watch('colors').indexOf(detail.color);
            const index = sizeIndex * watch('colors').length + colorIndex;
            setValue(`imgUrls.${colorIndex}`, detail.imgUrl);
            setValue(`stocks.${index}`, detail.stock);
        });
        resetProductForm({
            name: productInfo.name,
            price: productInfo.price,
            discount: productInfo.discount,
            description: productInfo.description,
            categoryType: { value: `${productInfo.category.gender} - ${productInfo.category.type}`},
            sizes: sizesArray,
            colors: colorsArray,
            numberOfColor: [...new Set(productInfo.productDetails.map(detail => detail.color))].length.toString(),
            colorNames: [...new Set(productInfo.productDetails.map(detail => detail.colorName))],
            imgUrls: watch('imgUrls'),
            stocks: watch('stocks'),
        });
    }

    useEffect(() => {
        handleResetForm();
    }, [showProductDetail, productInfo])

    useEffect(() => {
        const colorCount = Number(watch('numberOfColor')) || 0;
        const currentColors = (watch('colors') || []).map(color => color === undefined ? '#000000' : color);
        const currentColorNames = watch('colorNames') || [];
        
        if (colorCount > currentColors.length) {
            setValue('colors', [
            ...currentColors,
            ...Array(colorCount - currentColors.length).fill('#000000'),
            ], { shouldValidate: true });
            setValue('colorNames', [
            ...currentColorNames,
            ...Array(colorCount - currentColors.length).fill(''),
            ], { shouldValidate: true })
        } else if (colorCount < currentColors.length) {
            setValue('colors', currentColors.slice(0, colorCount));
            setValue('colorNames', currentColorNames.slice(0, colorCount));
        }
    }, [watch('numberOfColor'), setValue, watch])

    useEffect(() => {
        const colors = (watch('colors') || []).map(color => color === undefined ? '#000000' : color);
        const uniqueColors = new Set(colors);
        
        if (uniqueColors.size !== colors.length) {
          setColorErrorMessage('Product colors must be unique');
        } else {
          setColorErrorMessage('');
        }
    }, [watch('numberOfColor'), watch('colors')]);

    useEffect(() => {
        const currentSizes = watch('sizes').length;
        const currentColors = Number(watch('numberOfColor'));
        if(currentSizes === 0 || currentColors === 0) {
            resetProductForm({
                name: productInfo.name,
                price: productInfo.price,
                discount: productInfo.discount,
                description: productInfo.description,
                categoryType: { value: `${productInfo.category.gender} - ${productInfo.category.type}`},
                sizes: watch('sizes'),
                colors: [],
                numberOfColor: watch('numberOfColor'),
                colorNames: [],
                imgUrls: [],
                stocks: [],
            });
        }
    },[watch('sizes'), watch('numberOfColor')])

    useEffect(() => {
        if (watch('sizes').length > 0 && watch('colors').length > 0 && colorErrorMessage === '') {
            setEnabled();
        }
        else {
            setDisabled();
            setFalse();
        }
    }, [watch('sizes'), watch('colors'), watch('numberOfColor'), colorErrorMessage])

    useEffect(() => {
        const stockAll = watch('stockAll');
        if (stockAll && stockAll > 0) {
            const stocks = Array.from({ length: watch('sizes').length * watch('colors').length }).map(() => stockAll as number);
            setValue('stocks', stocks as number[]);
        }
    }, [watch('stockAll')])

    useEffect(() => {
        const options = Array.from(category).map(cate => 
          `${cate.gender} - ${cate.type}`
        );
        setCategoryOptions(options);
    }, [category]);

    const handleUpload = async (e: { files: File[] }) => {
        const file = e.files[0];
        const url = await uploadToCloudinary(file);
        return url ? url : null;
    }

    const deleteProduct = async (productId: string) => {
        callApiManageProduct(async () => {
            const { data } = await productApi.deleteProduct(productId)
            if (data) {
                toggleProductChange()
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Delete Successfully', life: 3000 });
            } else {
                toast.current?.show({ severity: 'error', summary: 'Failed', detail: `${errorMessage}`, life: 3000 });
            }
        })
    }
    
    const updateProduct = async (updateProductData: IInputProduct) => {
        callApiManageProduct(async () => {
            try {
            const productDetails: ICreateProductDetail[] = []
            updateProductData.sizes.forEach((size, sizeIndex) => {
                updateProductData.colors.forEach((color, colorIndex) => {
                    const colorName = updateProductData.colorNames[colorIndex];
                    const imgUrl = updateProductData.imgUrls[colorIndex] || '';
                    const stock = updateProductData.stocks[colorIndex + sizeIndex * updateProductData.colors.length];
                    color = color || '#000000';
                    productDetails.push({size, colorName, color, imgUrl, stock})
                })
            })

            const {categoryType, ...updateProductInfo} = updateProductData;
            const categoryId = category.find((category) => `${category.gender} - ${category.type}` === categoryType.value)?.id || '';
            const sendData = {name: updateProductInfo.name, description: updateProductInfo.description, price: updateProductInfo.price, categoryId: categoryId, productDetails: productDetails, discount: updateProductInfo.discount || 0}
            const { data } = await productApi.updateProduct(productInfo.id, sendData)
                if (data) {
                    handleToggle()
                    toggleProductChange()
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Update Product Successfully', life: 3000 });
                }
            } catch {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `${errorMessage}`,
                    life: 3000,
                });
            }
        })
    }
    const handleToggleAction = (action: () => void) => {
        action();
        if (op.current) {
            op.current.hide();
        }
    }
    const handleDeteleImage = (index: number) => {
        const newImgUrls = [...watch('imgUrls')];
        newImgUrls[index] = '';
        if (fileUploadReference.current) {
            fileUploadReference.current.clear();
        }
        setValue('imgUrls', newImgUrls);
    }
    const handleChangeColor = (e: ColorPickerChangeEvent, index: number) => {
        const newColors = [...watch('colors')];
        const colorCode = '#' + (e.target.value as string);
        newColors[index] = colorCode;
        setValue('colors', newColors);
    }
    const handleChangeSize = (field: ControllerRenderProps<ControllerType, "sizes"> , size: string) => {
        const newSize = field.value.includes(size)
        ? field.value.filter((item) => item !== size)
        : [...field.value, size];
        field.onChange(newSize);
    }
    const handleShowImage = (index: number) => {
        setVisibleIndex(index);
        setShowDialog();
    }
  return (
    <div className='flex flex-row'>
        <Toast ref={toast} />
        <div className='flex justify-center items-center'>
            <PrimeBtn text onClick={(e) => op.current && op.current.toggle(e)}>
                <div className='items-center justify-center flex'>
                    {icons.list}
                </div>
            </PrimeBtn>
            <OverlayPanel ref={op} className="w-fit bg-white border border-gray-300 shadow-lg rounded-lg p-1">
                <PrimeBtn text className='flex w-full transition text-sm gap-2'
                    onClick={() => handleToggleAction(toggleShowProductDetail)}
                >{icons.search}Detail</PrimeBtn>
                <PrimeBtn text className='flex w-full transition text-sm text-red-500 gap-2'
                    onClick={() => handleToggleAction(toggleShowConfirmDelete)}
                >{icons.deleteProduct}Delete</PrimeBtn>
            </OverlayPanel>
            <ConfirmDialog
                visible={showConfirmDelete}
                onHide={hideConfirmDelete}
                message="Are you sure you want to delete this product?"
                header="Delete Confirmation"
                accept={() => deleteProduct(productInfo.id)}
                reject={hideConfirmDelete}
                acceptLabel="Delete"
                rejectLabel="Cancel"
                acceptClassName="p-button-danger"
            />
            <Sidebar visible={showProductDetail} onHide={handleToggle} position="right" className="w-2/5">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Product Detail</h2>
                <form onSubmit={handleSubmit(updateProduct)}>
                    <div className="mb-5">
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <span className="mr-2">{icons.productName}</span> Product Name
                        </label>
                        <Input control={control} errors={errors} name="name" className="w-full rounded-lg"/>
                    </div>
                    <div className="mb-5 flex flex-row gap-4">
                        <div className="w-1/2">
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <span className="mr-2">{icons.productPrice}</span> Product Price
                            </label>
                            <Input control={control} errors={errors} name="price" className="w-full rounded-lg"/>
                        </div>
                        <div className="w-1/2">
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <span className="mr-2">{icons.productDiscount}</span> Product Discount
                            </label>
                            <Input control={control} errors={errors} name="discount" className="w-full rounded-lg"/>
                        </div>
                    </div>
                    <div className="mb-5">
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <span className="mr-2">{icons.productCategory}</span> Category
                        </label>
                        <Controller
                            name="categoryType"
                            control={control}
                            render={({ field }) => (
                                <Dropdown 
                                value={field.value?.value || ''} 
                                onChange={(val) => field.onChange({ value: val.target.value })} 
                                options={categoryOptions} optionLabel="name" 
                                placeholder="Select Category" 
                                className="w-full md:w-14rem" 
                                />
                                )}
                        />
                        {errors.categoryType?.value && <span className="text-red-500">{errors.categoryType.value.message}</span>}
                    </div>
                    <div className="mb-5 flex flex-row gap-4">
                        <div className="w-2/3">
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <span className="mr-2">{icons.productSize}</span> Sizes
                            </label>
                            <div className={`flex flex-row gap-4 border border-gray-300 rounded-md p-[9px] ${errors.sizes ? "border-red-500":''}`}>
                                {sizes.map((size) => (
                                    <div key={size}>
                                        <Controller
                                        name="sizes"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <input
                                                type="checkbox"
                                                value={size}
                                                checked={field.value.includes(size)}
                                                onChange={() => handleChangeSize(field, size)}
                                                className="rounded-lg size-4"
                                                />
                                                <label className="ml-2 text-lg">{size}</label>
                                            </>
                                            )}
                                        />
                                    </div>
                                ))}
                            </div>
                            {errors.sizes && <span className="text-red-500">{errors.sizes.message}</span>}
                        </div>
                        <div className="w-1/3">
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <span className="mr-2">{icons.numberOfColor}</span> Number of Colors
                            </label>
                            <Input control={control} errors={errors} name="numberOfColor" className="w-full rounded-lg"/>
                        </div>
                    </div>
                    <div className="mb-5">
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                            <span className="mr-2">{icons.productDescription}</span> Product Description
                        </label>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Editor
                                    value={field.value}
                                    placeholder="Product Description"
                                    onTextChange={(e: EditorTextChangeEvent) => field.onChange(e.htmlValue || '')}
                                    style={{ height: '375px', width: '100%' }}
                                />
                            )}
                        />
                        {errors.description &&<span className="text-red-500">{errors.description.message}</span>}
                    </div>
                    {Number(watch('numberOfColor')) > 0 && <div className="mb-5">
                        <div className={`${Number(watch('numberOfColor')) > 2 ? 'overflow-y-scroll h-[280px]' : ''} 
                        bg-gray-50 rounded-lg p-4 border border-gray-200`}>
                            {Array.from({ length: Number(watch('numberOfColor')) }).map((_, index) => (
                                <div key={index} className="flex flex-col space-y-3 mb-4 last:mb-0">
                                    <div>
                                        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                            <span className="mr-2">{icons.productColor}</span> Color {index + 1}
                                        </label>
                                        <div className="flex items-center justify-between space-x-4">
                                            <Controller
                                                name={`colors.${index}`}
                                                control={control}
                                                render={({ field }) => (
                                                    <ColorPicker
                                                        {...field}
                                                        format="hex"
                                                        value={field.value ? field.value : '000000'}
                                                        onChange={(e) => handleChangeColor(e, index)}
                                                    />
                                                )}
                                            />
                                            <div>
                                                <Input
                                                    name={`colorNames.${index}`}
                                                    control={control}
                                                    errors={errors}
                                                    className="flex-1"
                                                    placeholder="Color Name"
                                                />
                                                {errors.colorNames?.[index] && !watch(`colorNames.${index}`) && 
                                                <span className="text-sm text-red-500">{errors.colorNames[index].message}</span>}
                                            </div>
                                            <div className="flex flex-row gap-4 items-center">
                                                {!watch(`imgUrls.${index}`) && (
                                                    <Controller
                                                        name={`imgUrls.${index}`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <div className="flex flex-col">
                                                                <FileUpload
                                                                    ref={fileUploadReference}
                                                                    mode="basic"
                                                                    accept="image/*"
                                                                    maxFileSize={1500000}
                                                                    auto
                                                                    customUpload
                                                                    uploadHandler={async (e) => {
                                                                        const url = await handleUpload(e);
                                                                        if (url) {
                                                                            field.onChange(url);
                                                                        }
                                                                    }}
                                                                    chooseLabel="Upload"
                                                                />
                                                                {errors.imgUrls?.[index] && <span className="text-red-500 text-sm mt-2">{errors.imgUrls[index].message}</span>}
                                                            </div>
                                                        )}
                                                    />
                                                )}
                                                <div className="w-[85px] h-[85px] relative group">
                                                    {watch(`imgUrls.${index}`) && (
                                                        <div className="relative">
                                                            <img src={watch(`imgUrls.${index}`)} alt={`Product ${index}`} className="w-[85px] h-[85px] object-cover mt-2 rounded-md" onClick={() => handleShowImage(index)}/>
                                                            <button
                                                                type="button"
                                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                                                onClick={() => handleDeteleImage(index)}
                                                            >
                                                                {icons.closePopup}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {colorErrorMessage && <div className="mt-3 text-sm text-red-500">{colorErrorMessage}</div>}
                    </div>}
                    {visibleIndex !== null && (
                        <Dialog header="Image Preview" visible={showDialog} onHide={setHideDialog} style={{ width: '50vw' }}>
                            <img src={watch(`imgUrls.${visibleIndex}`)} alt={`Product ${visibleIndex}`} className="w-full rounded-md" />
                        </Dialog>
                    )}
                    {showStock && 
                        <>
                            <div className="mb-5">
                                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                    <span className="mr-2">{icons.productStock}</span> Stock for all product
                                </label>
                                <Input control={control} errors={errors} name="stockAll" className="w-full rounded-lg"/>
                            </div>
                            <div className="flex flex-col gap-4 mb-5">
                                <div className={`${Number(watch('numberOfColor')) >= 1 && watch('sizes').length !== 0
                                            ? 'overflow-y-scroll h-fit max-h-[250px] bg-gray-50 rounded-lg p-4 border border-gray-200'
                                            : ''}`}>
                                    {watch('colors').map((_, colorIndex) => (
                                        <div key={colorIndex} className="mb-6">
                                            {watch('sizes').map((size, sizeIndex) => {
                                                const index = sizeIndex * watch('colors').length + colorIndex;
                                                return (
                                                    <div key={index} className="flex flex-col md:flex-row gap-6 md:gap-8 justify-between mb-5 p-4">
                                                        <div className="flex flex-col w-fit font-medium text-lg text-gray-700 justify-between items-start">
                                                            <label className="flex items-center text-sm mb-2">
                                                                <span className="mr-2">{icons.product}</span> Product
                                                            </label>
                                                            <div className="flex flex-row">
                                                                <span className="w-full md:w-[50%]">
                                                                    {`${watch('colorNames')[colorIndex]
                                                                            ? watch('colorNames')[colorIndex]
                                                                            : `${colorIndex + 1}`}`}
                                                                </span>
                                                                <span className="hidden md:block mx-3">-</span>
                                                                <span className="w-full md:w-[60%] text-left md:text-right">{`${size}`}</span>
                                                            </div>
                                                        </div>
                                                        <div className="w-[85px] h-[75px]">
                                                            {watch(`imgUrls.${colorIndex}`) && (
                                                                <div>
                                                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                                                        <span className="mr-2">{icons.productImage}</span> Image
                                                                    </label>
                                                                    <img src={watch(`imgUrls.${colorIndex}`)} alt={`Product ${index}`} className="w-[85px] h-[85px] object-cover mt-2 rounded-md" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="w-full md:w-[400px]">
                                                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                                                <span className="mr-2">{icons.productStock}</span> Stock
                                                            </label>
                                                            <Input name={`stocks.${index}`} control={control} errors={errors.stocks} className="border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300"/>
                                                            {errors.stocks?.[index] && <span className="text-red-500 text-sm mt-2">{errors.stocks[index].message}</span>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                                {errorMessage && <span className="text-red-500 mb-2 text-lg">{errorMessage}</span>}
                            </div>
                        </>}
                    {showStock && 
                        <Button 
                            htmlType="submit" 
                            disabled={loading || !isDirty}
                            loading={loading}
                            className="w-fit bg-primary border-primary text-white rounded-lg py-2 hover:bg-primary-dark transition text-xl"
                        >
                        Update Product
                        </Button>}
                </form>
                {!showStock && 
                <Button 
                    onClick={setTrue}
                    disabled={isDisabled}
                    className="w-fit bg-primary border-primary text-white rounded-lg py-2 hover:bg-primary-dark transition text-xl"
                >
                Provide Stock
                </Button>}
            </Sidebar>
        </div>
    </div>
    )
}
