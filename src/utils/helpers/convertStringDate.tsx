export const convertStringDate = (stringTime: string): string => {
    const date = new Date(stringTime);
    const ngay = date.getDate();
    const thang = date.getMonth() + 1;
    const nam = date.getFullYear();
    return `${ngay < 10 ? '0' : ''}${ngay}/${thang < 10 ? '0' : ''}${thang}/${nam}`;
};