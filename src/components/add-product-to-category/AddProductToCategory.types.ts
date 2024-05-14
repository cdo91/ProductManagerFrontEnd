import { CategoryProps } from "../add-category/AddCategory.types";

export type ProductProps = {
  id: number;
  name: string;
  sku: string;
  description: string;
  imageUrl: string;
  price: number;
  category: CategoryProps;
}