export type Category = "Crafts" | "Food & Honey" | "Fashion" | "Tea & Coffee" | "Jewelry";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  image: string;
  description: string;
  isBestseller?: boolean;
}

export const products: Product[] = [];
