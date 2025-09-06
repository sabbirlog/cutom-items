// types.ts
export interface SubCategory {
  id: string;
  name: string;
}

export interface MainCategory {
  id: string;
  name: string;
  subcategories: SubCategory[];
}
