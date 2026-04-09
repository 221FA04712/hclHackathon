import React, { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import SearchBox from "./SearchBox";
import Dropdown from "./Dropdown";

const sortList = ["Popularity", "Price Low to High", "Price High to Low"];

export default function ProductListings({ products }) {
  const [searchText, setSearchText] = useState("");
  const [selectedSort, setSelectedSort] = useState("Popularity");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const categoryList = useMemo(() => {
    if (!Array.isArray(products)) return ["All Categories"];
    const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    return ["All Categories", ...uniqueCategories];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    if (!Array.isArray(products)) {
      return [];
    }

    let filteredProducts = products.filter(
      (product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase()) ||
                              product.description.toLowerCase().includes(searchText.toLowerCase());
        const matchesCategory = selectedCategory === "All Categories" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }
    );

    return filteredProducts.slice().sort((a, b) => {
      switch (selectedSort) {
        case "Price Low to High":
          return parseFloat(a.price) - parseFloat(b.price);
        case "Price High to Low":
          return parseFloat(b.price) - parseFloat(a.price);
        case "Popularity":
        default:
          return parseInt(b.popularity) - parseInt(a.popularity);
      }
    });
  }, [products, searchText, selectedSort, selectedCategory]);

  function handleSearchChange(inputSearch) {
    setSearchText(inputSearch);
  }

  function handleSortChange(sortType) {
    setSelectedSort(sortType);
  }

  function handleCategoryChange(category) {
    setSelectedCategory(category);
  }

  return (
    <div className="max-w-[1152px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-12">
        <SearchBox
          label="Search"
          placeholder="Search products..."
          value={searchText}
          handleSearch={(value) => handleSearchChange(value)}
        />
        <div className="flex flex-wrap items-center gap-4 justify-end">
          <Dropdown
            label="Category"
            options={categoryList}
            selectedValue={selectedCategory}
            handleSort={(value) => handleCategoryChange(value)}
          />
          <Dropdown
            label="Sort by"
            options={sortList}
            selectedValue={selectedSort}
            handleSort={(value) => handleSortChange(value)}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-6 py-12">
        {filteredAndSortedProducts.length > 0 ? (
          filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))
        ) : (
          <p className="text-center font-primary font-bold text-lg text-primary dark:text-light col-span-full">
            No products found
          </p>
        )}
      </div>
    </div>
  );
}
