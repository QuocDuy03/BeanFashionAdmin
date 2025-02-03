import { useEffect, useRef, useState } from "react";
import { useForm, Controller, ControllerRenderProps } from "react-hook-form";

import { Toast } from 'primereact/toast';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { FileUpload } from 'primereact/fileupload';
import { Editor, EditorTextChangeEvent } from 'primereact/editor';
import { Dropdown } from 'primereact/dropdown';
import { ColorPicker, ColorPickerChangeEvent } from 'primereact/colorpicker';
import { Button as PrimeBtn } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Dialog } from "primereact/dialog";

import { yupResolver } from "@hookform/resolvers/yup";

import { uploadToCloudinary } from "@/utils/helpers";
import { schema, sizes, filterOptions } from "@/utils/constants";
import { icons } from "@/utils/icons";

import { productApi } from "@/apis";
import { ICategory, ICreateProductDetail, IInputProduct } from "@/interfaces";
import { useApi, useBoolean } from "@/hooks";
import { Button, Input } from "@/components";

type ProductHeaderProps = {
    category: ICategory[];
    setQuery: (query: string) => void;
    setFilter: (filter: string) => void;
    toggleProductChange: () => void;
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

export const ProductHeader: React.FC<ProductHeaderProps> = ({category, setQuery, setFilter, toggleProductChange}) => {
    const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
    const [colorErrorMessage, setColorErrorMessage] = useState<string>('');
    const toast = useRef<Toast>(null);
    const fileUploadReference = useRef<FileUpload>(null);

    const {value: addProduct, toggle: toggleAddProduct } = useBoolean(false);
    const { loading, errorMessage, callApi: callApiSendProduct } = useApi<void>()
    const {value: showStock, setFalse, setTrue} = useBoolean(false);
    const {value: isDisabled, setTrue: setDisabled, setFalse: setEnabled} = useBoolean(true);
    const op = useRef<OverlayPanel>(null);
    const {value: showDialog, setTrue: setShowDialog, setFalse: setHideDialog} = useBoolean(false);
    const [visibleIndex, setVisibleIndex] = useState<number | null>(null);
    const {
        control,
        handleSubmit,
        reset: resetProductForm,
        formState: { errors },
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
            setValue('colorNames', []);
            setValue('colors', []);
            setValue('imgUrls', []);
            setValue('stocks', []);
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
    
    const handleToggle = () => {
        toggleAddProduct();
        resetProductForm();
        setValue('sizes', []);
        setValue('colorNames', []);
        setValue('colors', []);
        setValue('imgUrls', []);
        setValue('stocks', []);
    }
    const handleCreateProduct = (productData: IInputProduct) => {
        callApiSendProduct(async () => {
            const productDetails: ICreateProductDetail[] = []
            productData.sizes.forEach((size, sizeIndex) => {
                productData.colors.forEach((color, colorIndex) => {
                    const colorName = productData.colorNames[colorIndex];
                    const imgUrl = productData.imgUrls[colorIndex] || '';
                    const stock = productData.stocks[colorIndex + sizeIndex * productData.colors.length];
                    color = color || '#000000';
                    productDetails.push({size, colorName, color, imgUrl, stock})
                })
            })
            const {categoryType, ...productInfo} = productData;
            const categoryId = category.find((category) => `${category.gender} - ${category.type}` === categoryType.value)?.id || '';
            const sendData = {name: productInfo.name, description: productInfo.description, price: productInfo.price, categoryId: categoryId, productDetails: productDetails, discount: productInfo.discount || 0}
            const {data} = await productApi.createProduct(sendData);
            if (data) {
                handleToggle();
                toggleProductChange();
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Add Product Successfully',
                    life: 3000,
                });
            }
        })
    };
    const handleToggleAction = (value: string) => {
        setFilter(value);
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
        <div className='flex flex-row w-[95%] h-fit justify-between m-auto mt-2'>
            <Toast ref={toast} />
            <div className='text-black-light text-2xl font-bold leading-tight text-left'>Products</div>
            <div className="flex flex-row gap-3">
                <IconField iconPosition="left">
                    <InputIcon>
                        {icons.searchProduct}
                    </InputIcon>
                    <Input name="search" placeholder="Search" className="rounded-lg h-full w-[350px] text-[16px]" onChange={(e) => setQuery(e.target.value)}/>
                </IconField>
                <div>
                    <PrimeBtn onClick={(e) => op.current && op.current.toggle(e)}>
                        <div className='flex items-center justify-center gap-2'>
                            {icons.filter}
                            <span>Filter</span>
                        </div>
                    </PrimeBtn>
                    <OverlayPanel ref={op} className="w-fit p-1 bg-white border border-gray-300 shadow-lg rounded-lg">
                        {filterOptions.map((option) => (
                            <PrimeBtn text key={option.label} className="flex w-full text-sm font-medium text-gray-700 transition-all rounded-lg"
                                onClick={() => handleToggleAction(option.value)}
                            >{option.label}</PrimeBtn>
                        ))}
                    </OverlayPanel>
                </div>
                <Button className="rounded-md" onClick={toggleAddProduct}>
                    <div className='flex items-center justify-center gap-2'>
                      {icons.add}
                      <span>Add product</span>
                    </div>
                </Button>
                <Sidebar visible={addProduct} onHide={handleToggle} position="right" className="w-2/5">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Product</h2>
                    <form onSubmit={handleSubmit(handleCreateProduct)}>
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
                            {errors.categoryType?.value && (
                                <span className="text-red-500">{errors.categoryType.value.message}</span>
                            )}
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
                            {errors.description && (
                                <span className="text-red-500">{errors.description.message}</span>
                            )}
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
                                                                    {errors.imgUrls?.[index] && (
                                                                        <span className="text-red-500 text-sm mt-2">
                                                                            {errors.imgUrls[index].message}
                                                                        </span>
                                                                    )}
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
                                                                    <img src={watch(`imgUrls.${colorIndex}`)} alt={`Product ${index}`} className="w-[85px] h-[85px] object-cover mt-2 rounded-md"/>
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
                                disabled={loading} loading={loading}
                                className="w-fit bg-primary border-primary text-white rounded-lg py-2 hover:bg-primary-dark transition text-xl"
                            >
                            Add Product
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
    );
};

export default ProductHeader;