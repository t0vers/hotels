import {ICategory} from "./category.interface";

export interface IRoom {
    id: number;
    title: string;
    category: ICategory;
    description: string;
    price: number;
    images: string[]
}
