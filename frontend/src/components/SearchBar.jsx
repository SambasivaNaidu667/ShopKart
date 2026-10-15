import React from "react";
import { Search, Filter, X, ArrowUpDown } from "lucide-react";

export default function SearchBar({
  search,
  setSearch,
  category,
  setCategory,
  sort = "default",
  setSort,
  onResetFilters,
}) {
  const categories = [
    "All Categories",
    "Electronics",
    "Fashion",
    "Books",
    "Home",
    "Sports",
    "Beauty",
  ];

  const hasActiveFilters =
    (search && search.trim() !== "") ||
    (category && category !== "All Categories" && category !== "All") ||
    (sort && sort !== "default");

  return (
    <div className="search-filter-container">
      {/* Search Input Box */}
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search products by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
          id="product-search-input"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="search-clear-btn"
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="filter-controls-wrapper">
        {/* Category Selector */}
        <div className="select-wrapper">
          <Filter size={16} className="select-icon" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="filter-select"
            id="product-category-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Selector */}
        {setSort && (
          <div className="select-wrapper">
            <ArrowUpDown size={16} className="select-icon" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="filter-select"
              id="product-sort-select"
            >
              <option value="default">Sort by: Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        )}

        {/* Clear All Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="btn-clear-filters"
            id="btn-clear-filters"
          >
            <X size={15} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
