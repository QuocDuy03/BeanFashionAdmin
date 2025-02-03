export interface IAuthor {
    id: string;
    fullName: string;
    avatar: string;
}

export interface IBlog {
    id: string;
    title: string;
    description: string;
    content: string;
    slug: string;
    coverImage: string;
    author: IAuthor;
    createdAt: string;
}

export interface IBlogForm {
    title: string;
    description: string;
    content: string;
    coverImage: string;
}

export interface ISortStyle { 
    name: string, 
    code: string 
};

export interface IGetBlogsParams {
    page: number, 
    limit: number, 
    sortStyle: string, 
    authors: string[], 
    keyword: string | undefined, 
    createDateRange: Date[]
}