import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from "react-router-dom";

import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Calendar } from 'primereact/calendar';
import { Nullable } from "primereact/ts-helpers";
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { BlogCard, Button, Search } from '@/components';
import { IBlog, ISortStyle, IAuthor, IGetBlogsParams } from '@/interfaces';
import { blogApi } from "@/apis";
import { useApi } from "@/hooks";
import { icons, sortStyle, initFilters } from '@/utils';

type FormData = {
    searchValue?: string
}

export function BlogsList() {
    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const [first, setFirst] = useState<number>(0);
    const [limit, setLimit] = useState<number>(8);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [choosedBlogs, setChoosedBlogs] = useState<string[]>([]);
    const [createDateRange, setCreateDateRange] = useState<Nullable<(Date | null)[]>>(null);
    const [allAuthors, setAllAuthors] = useState<IAuthor[]>([]);
    const [choosedAuthors, setChoosedAuthors] = useState<string[]>([]);
    const [selectedSortStyle, setSelectedSortStyle] = useState<ISortStyle>(sortStyle[0]);
    const toast = useRef<Toast>(null);
    const { errorMessage: deleteErrorMessage, callApi: callDeleteApi } = useApi<void>()
    const { callApi: callGetBlogsApi } = useApi<void>();
    const [loadingBlogs, setLoadingBlogs] = useState<boolean>(false);
    const [loadingAuthors, setLoadingAuthors] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const defaultValues: FormData = {
        searchValue: ''
    }

    const schema = yup.object().shape({
        searchValue: yup.string().trim()
    })

    const {
        control,
        formState: { errors },
        handleSubmit,
        getValues,
        setValue
    } = useForm({ defaultValues, resolver: yupResolver(schema) })

    const onSubmit = () => {
        handleFilterChange(initFilters.search.name, getValues('searchValue') || '', initFilters.search.isMultiFilter);
        setToFirstPage();
        getBlogs(1, limit);
    }

    const handleFilterChange = (filterKey: string, value: string, isMultiFilter : boolean) => {
        const currentValues = searchParams.get(filterKey)?.split(',') || [];
        if (!isMultiFilter) {
            searchParams.set(filterKey, value);
            !searchParams.get(filterKey) && searchParams.delete(filterKey);
        }
        else if (currentValues.includes(value)) {
            currentValues.splice(currentValues.indexOf(value), 1);
            currentValues.length === 0 ? 
                searchParams.delete(filterKey) 
                : 
                searchParams.set(filterKey,currentValues.join(','));
        }
        else {
            currentValues.push(value);
            searchParams.set(filterKey, currentValues.join(','));
        }
        setSearchParams(searchParams);
    }

    const setToFirstPage = () => {
        setFirst(0);
        searchParams.set(initFilters.page.name, '1');
        setSearchParams(searchParams);
    }

    const acceptDelete = async () => {
        try {
            if (choosedBlogs.length > 0) {
                callDeleteApi(async () => {
                    const res = await blogApi.multiDelete(choosedBlogs);
                    if (res.status === 204) {
                        toast.current?.show({ severity: 'info', summary: 'Success', detail: 'Selected blogs have been deleted', life: 3000 });
                        setChoosedBlogs([]);
                        setToFirstPage();
                        getBlogs(1, limit);
                        getAuthors();
                    }
                    else {
                        toast.current?.show({ severity: 'error', summary: 'Failure', detail: `${deleteErrorMessage}`, life: 3000 });
                    }
                });
            }
        }
        catch (error) {
            console.error('Failed to delete blog: ', error);
            toast.current?.show({ severity: 'error', summary: 'Failure', detail: `${deleteErrorMessage}`, life: 3000 });
        }
    }

    const confirmDelete = () => {
        confirmDialog({
            message: 'Are you sure you want to delete these blogs?',
            header: 'Delete Blog',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: acceptDelete,
        });
    };

    const onChoosedBlogsChange = (event: CheckboxChangeEvent) => {
        const choosedBlogsTemp = [...choosedBlogs];
        if (event.checked) {
            choosedBlogsTemp.push(event.value);
        }
        else {
            choosedBlogsTemp.splice(choosedBlogsTemp.indexOf(event.value), 1);
        }
        setChoosedBlogs(choosedBlogsTemp);
    }

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setFirst(event.first);
        handleFilterChange(initFilters.page.name, (event.page + 1).toString(), initFilters.page.isMultiFilter);
        getBlogs(event.page + 1, limit);
    };

    const getBlogs = async (page : number, limit : number) => {
        try {
            setLoadingBlogs(true);
            const params: IGetBlogsParams = {
                page: Number(searchParams.get(initFilters.page.name)) || page,
                limit: limit,
                sortStyle: searchParams.get(initFilters.sortStyle.name) || '',
                authors: searchParams.get(initFilters.authors.name)?.split(',') || [],
                keyword: searchParams.get(initFilters.search.name) || '',
                createDateRange: searchParams.get(initFilters.createDateRange.name)?.split(',').map(date => new Date(date)) || [],
            }
            setFirst((params.page - 1)*limit);
            setLimit(params.limit);
            setSelectedSortStyle(sortStyle.find(style => style.code === params.sortStyle) || sortStyle[0]);
            setChoosedAuthors(params.authors);
            !createDateRange && setCreateDateRange(params.createDateRange);
            setValue('searchValue', params.keyword);
            await callGetBlogsApi(async () => {
                const response = await blogApi.getAll(params);
                setBlogs(response.data.data);
                setTotalRecords(response.data.total);
            });
            setLoadingBlogs(false);
        } catch (error) {
            setLoadingBlogs(false);
            setBlogs([]);
            setTotalRecords(0);
            console.error('Failed to fetch blogs: ', error);
        }
    }

    const getAuthors = async () => {
        try {
            setLoadingAuthors(true);
            await callGetBlogsApi(async () => {
                const response = await blogApi.getAuthors();
                setAllAuthors(response.data);
            });
            setLoadingAuthors(false);
        }
        catch (error) {
            setLoadingAuthors(false);
            console.error('Failed to fetch authors: ', error);
        }
    }

    const onChoosedAuthorsChange = (event: CheckboxChangeEvent) => {
        const choosedAuthorsTemp = [...choosedAuthors];
        if (event.checked) {
            choosedAuthorsTemp.push(event.value);
        }
        else {
            choosedAuthorsTemp.splice(choosedAuthorsTemp.indexOf(event.value), 1);
        }
        setChoosedAuthors(choosedAuthorsTemp);
        handleFilterChange(initFilters.authors.name, event.value, initFilters.authors.isMultiFilter);
        setToFirstPage();
    }

    const handleChangeSortStyle = (event: DropdownChangeEvent) => {
        setSelectedSortStyle(event.value);
        handleFilterChange(initFilters.sortStyle.name, event.value.code, initFilters.sortStyle.isMultiFilter);
    }

    const clearDateRange = () => {
        setCreateDateRange(null);
        handleFilterChange(initFilters.createDateRange.name, '', initFilters.createDateRange.isMultiFilter);
    };

    const handleChangeCreateDateRange = (dates: Nullable<(Date | null)[]>) => {
        setToFirstPage();
        setCreateDateRange(dates);
        const createDateRangeTemp : Date[] = dates && dates.length > 0
            ? [
                dates[0] || new Date(), 
                dates[1] || new Date()
            ]
            : [];
        handleFilterChange(initFilters.createDateRange.name, createDateRangeTemp.join(','), initFilters.createDateRange.isMultiFilter);
    }

    useEffect(() => {
        getBlogs(1, limit);
    }, [searchParams]);

    useEffect(() => {
        getAuthors();
    }, []);

    return (
        <div className='rounded-xl m-7 p-7 border text-left bg-white flex flex-col lg:flex-row gap-8'>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className='flex-1 flex flex-col gap-8'>
                <div className='w-full h-20 p-4 bg-gray-100 text-gray-500 rounded border'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Search
                            className='border-partial-primary-500 w-full'
                            control={control}
                            errors={errors}
                            size='small'
                            placeholder='Search blog'
                        />
                    </form>
                </div>
                <div className='flex flex-col gap-8 sm:flex-row lg:flex-col'>
                <div className='w-full p-4 bg-gray-100 text-gray-500 rounded border'>
                    <div className="flex flex-col justify-center gap-2">
                        <span className='font-bold uppercase'>Creation date</span>
                        <div className='flex justify-center items-center gap-1'>
                            <Calendar
                                value={createDateRange}
                                onChange={(event) => handleChangeCreateDateRange(event.value)}
                                selectionMode="range"
                                readOnlyInput
                                hideOnRangeSelection
                                maxDate={new Date()}
                                placeholder='Choose a date range' 
                                dateFormat="dd/mm/yy"
                            />
                            <span onClick={clearDateRange} className='text-3xl rounded-full text-gray-500 hover:bg-white m-0 p-0'>{icons.close}</span>
                        </div>
                    </div>
                </div>
                <div className='w-full p-4 bg-gray-100 text-gray-500 rounded border'>
                    <div className="flex flex-col justify-center items-start gap-2">
                        <span className='font-bold uppercase'>Authors</span>
                        {loadingAuthors ? (
                            <div className='flex justify-center items-center w-full'>
                                <ProgressSpinner className='w-10 h-10' />
                            </div>
                        ):(
                            allAuthors.map((author) => (
                                <div key={author.id} className='flex items-center gap-2'>
                                    <Checkbox
                                        inputId={author.id}
                                        name={author.fullName}
                                        value={author.id}
                                        onChange={onChoosedAuthorsChange}
                                        checked={choosedAuthors.includes(author.id)}
                                    />
                                    <label htmlFor={author.id} className="cursor-pointer">
                                        {author.fullName}
                                    </label>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                </div>
            </div>
            <div className='flex-[4] h-full'>
                <div className='h-20 bg-gray-100 py-4 px-2 border-y-2 flex justify-between items-center'>
                    <span className='font-bold text-3xl text-gray-700'>Blogs</span>
                    {choosedBlogs.length > 0 && (<Button onClick={confirmDelete} className='font-bold w-40 border-red-500 bg-red-500 hover:bg-red-600'>Delete Selected</Button>)}
                </div>
                <div className="w-full flex justify-end items-center gap-1 mt-4">
                    <span className="text-gray-500 flex items-center gap-1">{icons.sort}Sort:</span>
                    <Dropdown
                        value={selectedSortStyle}
                        onChange={(event: DropdownChangeEvent) => handleChangeSortStyle(event)}
                        options={sortStyle}
                        optionLabel="name"
                        className="w-36 text-gray-500 text-[0.75rem] leading-[0.1rem] border-none bg-gray-50 rounded-none"
                    />
                </div>
                {loadingBlogs ? (
                    <div className='flex justify-center items-center min-h-96'>
                        <ProgressSpinner />
                    </div>
                ):(
                    blogs.length === 0 ? (
                        <div className='flex flex-col items-center justify-center bg-gray-50 m-7 p-4 min-h-96'>
                            <span className="text-2xl font-bold text-gray-500">Blog not found</span>
                        </div>
                    ) : (
                        <div className='flex flex-col justify-between min-h-[100vh]'>
                            <div className='flex flex-col justify-center flex-wrap items-center mt-4 gap-4'>
                                <div className='text-center grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-10'>
                                    {blogs?.map((blog) => (
                                        <div key={blog.slug}>
                                            <div className='w-full flex justify-end'>
                                                <Checkbox
                                                    inputId={blog.slug}
                                                    value={blog.slug}
                                                    onChange={onChoosedBlogsChange}
                                                    checked={choosedBlogs.includes(blog.slug)}
                                                    className='z-50 -mb-6'
                                                />
                                            </div>
                                            <BlogCard blog={blog} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                )}
                <div className='mt-4'>
                    <Paginator
                        first={first}
                        rows={limit}
                        totalRecords={totalRecords}
                        onPageChange={onPageChange}
                        alwaysShow={false}
                    />
                </div>
            </div>
        </div>
    )
}