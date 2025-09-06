"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { MainCategory } from "@/types/category";
import { FC, useState } from "react";
import MainCategoryDropdown from "./MainCategoryDropdown";
import SubCategoryDropdown from "./SubCategoryDropdown";

interface Props {
  categories: MainCategory[];
}

const CategoryDropdown: FC<Props> = ({ categories }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveringMain, setHoveringMain] = useState<string | null>(null);

  // Debounced main category for subcategory dropdown
  const activeMain = useDebounce(hoveringMain, 2000);

  const hoveredCategory = activeMain
    ? categories.find((cat) => cat.id === activeMain)
    : null;

  return (
    <div
      className="relative inline-block"
      onMouseLeave={() => {
        // leave entire dropdown → close everything
        setIsOpen(false);
        setHoveringMain(null);
      }}
    >
      {/* Category Button */}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onMouseEnter={() => {
          setIsOpen(true);
          // reset any hovered main category if hovering button directly
          setHoveringMain(null);
        }}
      >
        Categories
      </button>

      {/* Dropdown container */}
      {isOpen && (
        <div className="absolute top-full left-0 flex">
          {/* Main Category Dropdown */}
          <MainCategoryDropdown
            categories={categories}
            onHoverMain={setHoveringMain}
          />

          {/* SubCategory Dropdown */}
          {hoveredCategory?.subcategories?.length ? (
            <SubCategoryDropdown subcategories={hoveredCategory.subcategories} />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
