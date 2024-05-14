import { ProductProps } from "../add-product-to-category/AddProductToCategory.types";

export type CategoryProps = {
    id: number;
    name: string;
    products: ProductProps[];
};