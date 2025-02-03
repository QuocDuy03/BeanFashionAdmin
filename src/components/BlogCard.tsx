import { Link } from 'react-router-dom';

import { convertStringDate } from '@/utils/helpers';
import { IBlog } from '@/interfaces';

type NewsCardProps = {
    blog: IBlog
}

export function BlogCard({ blog }: NewsCardProps) {
    return (
        <div className="w-60 xs:w-80 md:w-72 xl:w-96 2xl:w-72 p-0 border-none">
            <div className='flex flex-col items-center justify-start w-full'>
                <div className='w-full h-60 z-0 bg-gray-300'>
                    <Link to={`/admin/blog/detail/${blog.slug}`} title={blog.title} className='z-0'>
                        <img
                            className="w-full h-60 object-contain z-0"
                            src={blog.coverImage}
                            alt={blog.title}
                        />
                    </Link>
                </div>
                <div className="h-44 overflow-hidden py-2 px-3 -mt-10 border rounded-md shadow-md z-50 w-11/12 bg-white">
                    <span className="text-center ">
                        <Link to={`/admin/blog/detail/${blog.slug}`} title={blog.title} className='font-bold h-12 flex items-center justify-center'>
                            <span className='text-blue-cyan hover:text-primary transition duration-300 ease-in-out line-clamp-2'>{blog.title}</span>
                        </Link>
                    </span>
                    <div className="text-xs text-gray-600 text-center my-2 relative">
                        <span className="bg-blue-cyan border border-white text-white px-2 py-[1px] rounded-full z-10 relative">
                            {convertStringDate(blog.createdAt)}
                        </span>
                        <span className="absolute inset-0 border-b border-blue-cyan opacity-30 transform -translate-y-1/2"></span>
                    </div>
                    <p dangerouslySetInnerHTML={{ __html: blog.description }} className="text-center text-gray-600 line-clamp-3"></p>
                </div>
            </div>
        </div>
    );
};
