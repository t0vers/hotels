import {ICategory} from "./category.interface";

export interface IRoom {
    id?: number;
    title: string;
    category?: ICategory;
    category_id: number;
    description: string;
    price: number;
    images: string[]
}
