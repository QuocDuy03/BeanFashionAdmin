import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Avatar } from 'primereact/avatar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';

import { Button } from "@/components";
import { convertStringDate, PATH } from '@/utils';
import { blogApi } from "@/apis";
import { IBlog } from "@/interfaces";
import { useBoolean, useApi } from "@/hooks";
import { icons } from "@/utils";

export function BlogDetail() {
    const [blog, setBlog] = useState<IBlog | null>(null);
    const {slug} = useParams<{ slug: string }>();
    const toast = useRef<Toast>(null);
    const { value: isNavigating, setTrue: startNavigating } = useBoolean(false);
    const { errorMessage: deleteErrorMessage, callApi: callDeleteApi } = useApi<void>()
    const { callApi: callGetBlogApi } = useApi<void>();
    const navigate = useNavigate();
    const [loadingBlog, setLoadingBlog] = useState<boolean>(false);

    const acceptDelete = async () => {
        try {
            if (blog) {
                callDeleteApi(async () => {
                    const res = await blogApi.delete(blog.slug);
                    if (res.status === 204) {
                        toast.current?.show({ severity: 'info', summary: 'Success', detail: 'This blog has been deleted', life: 3000 });
                        startNavigating();
                        setTimeout(() => {
                            navigate(PATH.blogList);
                        }, 3000);
                    }
                    else {
                        toast.current?.show({ severity: 'error', summary: 'Failed', detail: `${deleteErrorMessage}`, life: 3000 });
                    }
                });
            }
        }
        catch (error) {
            console.error('Failed to delete blog: ', error);
            toast.current?.show({ severity: 'error', summary: 'Failed', detail: `${deleteErrorMessage}`, life: 3000 });
        }
    }

    const confirmDelete = () => {
        confirmDialog({
            message: 'Are you sure you want to delete this blog?',
            header: 'Delete Blog',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: acceptDelete,
        });
    };
    
    const getBlog = async () => {
        setLoadingBlog(true);
        if (slug) {
            await callGetBlogApi(async () => {
                const res = await blogApi.getOne(slug);
                if (res.status === 200) {
                    setBlog(res.data);
                }
            });
        }
        setLoadingBlog(false);
    }
    
    useEffect(() => {
        getBlog();
    },[]);

    return (
        <div className="flex flex-col items-center justify-start bg-white rounded-xl m-7 p-7 border min-h-[80vh]">
            <Toast ref={toast} />
            <ConfirmDialog />
                {loadingBlog ? (
                    <div className='flex justify-center items-center min-h-[100vh] max-w-[1200px]'>
                        <ProgressSpinner />
                    </div>
                ):(
                    blog ? (
                        <div className="flex flex-wrap md:flex-row gap-6 justify-between w-full max-w-[1200px]">
                            <div className='w-full'>
                                <div className="w-full flex justify-between items-start text-left flex-col sm:flex-row">
                                    <div className="flex flex-col gap-2 justify-start items-start">
                                        <span className="font-semibold text-2xl text-primary">{blog.title}</span>
                                        <div className="flex flex-row items-center gap-2 border border-gray-300 rounded-md py-1 px-2">
                                            <span className="text-xl text-primary">{icons.watch}</span>
                                            <span className="text-sm font-semibold">{convertStringDate(blog.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col min-w-fit items-center justify-start gap-1">
                                        <Avatar image={blog.author.avatar} icon={icons.faUser} className="p-0.5" size="xlarge" shape="circle" />
                                        <span className="text-gray-800 font-semibold">{blog.author.fullName}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start mt-2">{blog.description}</div>
                                <div className="flex justify-center my-7">
                                    <img src={blog.coverImage} alt="cover" className="w-full h-auto object-contain rounded-md" />
                                </div>
                                <div dangerouslySetInnerHTML={{ __html: blog.content }} className=""></div>
                            </div>
                            <div className='flex flex-wrap flex-col xs:flex-row justify-end gap-4 w-full'>
                                <Button disabled={isNavigating} onClick={confirmDelete} className="font-bold border-red-500 bg-red-500 hover:bg-red-600 w-40">Delete</Button>
                                <Button disabled={isNavigating} to={'/admin/blog/update/' + blog.slug} className="font-bold w-40">Update</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center bg-white rounded-xl m-7 p-7 border">
                            <span className="text-2xl font-bold text-primary">Blog not found</span>
                        </div>
                    )
                )}
        </div>
    );
}