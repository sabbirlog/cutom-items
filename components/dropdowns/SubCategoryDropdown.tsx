"use client";

import { SubCategory } from "@/types/category";
import { FC } from "react";

interface Props {
  subcategories: SubCategory[];
}

const SubCategoryDropdown: FC<Props> = ({ subcategories }) => {
  return (
    <div className="ml-1 w-48 bg-white border border-gray-200 shadow-lg max-h-96 overflow-y-auto dropdown-scrollbar">
      {subcategories.map((sub) => (
        <div
          key={sub.id}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          {sub.name}
        </div>
      ))}
    </div>
  );
};

export default SubCategoryDropdown;
