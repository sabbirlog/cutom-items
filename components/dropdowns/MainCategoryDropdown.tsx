"use client";

import { MainCategory } from "@/types/category";
import { FC } from "react";

interface Props {
  categories: MainCategory[];
  onHoverMain: (id: string | null) => void;
}

const MainCategoryDropdown: FC<Props> = ({ categories, onHoverMain }) => {
  return (
    <div className="w-48 bg-white border border-gray-200 shadow-lg max-h-96 overflow-y-auto dropdown-scrollbar">
      {categories.map((main) => (
        <div
          key={main.id}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onMouseEnter={() => onHoverMain(main.id)}
        >
          {main.name}
        </div>
      ))}
    </div>
  );
};

export default MainCategoryDropdown;
