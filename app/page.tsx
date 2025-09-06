import CategoryDropdown from "@/components/dropdowns/CategoryDropdown";
import { MainCategory } from "@/types/category";
import type { NextPage } from "next";

const categories: MainCategory[] = Array.from({ length: 15 }, (_, mainIndex) => ({
  id: `${mainIndex + 1}`,
  name: `Main Category ${mainIndex + 1}`,
  subcategories: Array.from({ length: 20 }, (_, subIndex) => ({
    id: `${mainIndex + 1}-${subIndex + 1}`,
    name: `Subcategory ${mainIndex + 1}-${subIndex + 1}`,
  })),
}));


const Home: NextPage = () => {
  return (
    <div className="p-10">
      <CategoryDropdown categories={categories} />
    </div>
  );
};

export default Home;
