import { ISortStyle } from "@/interfaces";

export const sortStyle: ISortStyle[] = [
    { name: 'Default', code: 'DEFAULT' },
    { name: 'A -> Z', code: 'NAME_ASC' },
    { name: 'Z -> A', code: 'NAME_DESC' },
    { name: 'Newest', code: 'DATE_DESC' },
    { name: 'Oldest', code: 'DATE_ASC' }
];