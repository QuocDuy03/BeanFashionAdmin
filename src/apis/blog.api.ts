import { IBlogForm, IGetBlogsParams } from "@/interfaces";
import { instance as axiosClient } from "@/configs";
import moment from "moment";

export const blogApi = {
    create: async (blog: IBlogForm) => {
        return axiosClient.post('/blogs/create', blog);
    },
    getAll: async (params : IGetBlogsParams) => {
        const formattedParams = {
            ...params,
            createDateRange: params.createDateRange.map(date => moment(date).format('YYYY-MM-DD'))
        }
        return axiosClient.get('/blogs', {params: formattedParams});
    },
    getAuthors: async () => {
        return axiosClient.get('/blogs/authors');
    },
    getOne: async (slug : string) => {
        return axiosClient.get(`/blogs/${slug}`);
    },
    update: async (slug : string, blog: IBlogForm) => {
        return axiosClient.patch(`/blogs/update/${slug}`, blog);
    },
    delete: async (slug : string) => {
        return axiosClient.delete(`/blogs/delete/${slug}`);
    },
    multiDelete: async (slugsList : string[]) => {
        return axiosClient.delete('/blogs/delete', { data: slugsList });
    }
}