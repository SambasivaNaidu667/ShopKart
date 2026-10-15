import React, { useState, useEffect } from "react";
import { Search, PackageX, RotateCcw, AlertTriangle, Sparkles, Filter } from "lucide-react";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { getProducts } from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [sort, setSort] = useState("default");

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts({ search, category, sort });
      if (data && data.products) {
        setProducts(data.products);
      } else if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
      setError(err.response?.data?.message || err.message || "Failed to load products from ShopKart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, sort]);

  const handleResetFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setSort("default");
  };

  return (
    <div className="products-page">
      {/* Products Hero Banner */}
      <div className="products-hero">
        <div className="products-hero-content">
          <span className="products-hero-badge">
            <Sparkles size={14} /> ShopKart Product Catalog
          </span>
          <h1 className="products-hero-title">Explore Our Premium Collection</h1>
          <p className="products-hero-subtitle">
            Find the best products with authentic quality, competitive pricing, and fast delivery right to your doorstep.
          </p>
        </div>
      </div>

      <div className="products-container">
        {/* Search & Filter Toolbar */}
        <SearchBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
          onResetFilters={handleResetFilters}
        />

        {/* Results Header */}
        {!loading && !error && (
          <div className="products-results-header">
            <div className="products-count-badge">
              <Filter size={16} />
              <span>
                Showing <strong>{products.length}</strong> {products.length === 1 ? "product" : "products"}
              </span>
            </div>

            <div className="active-filter-tags">
              {search && <span className="filter-pill">Search: "{search}"</span>}
              {category && category !== "All Categories" && (
                <span className="filter-pill">Category: {category}</span>
              )}
              {sort && sort !== "default" && (
                <span className="filter-pill">Sort: {sort.replace("_", " ")}</span>
              )}
            </div>
          </div>
        )}

        {/* Loading State with Skeleton Grid */}
        {loading && (
          <div className="loading-state-container">
            <div className="products-skeleton-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="skeleton-card">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-line skeleton-title"></div>
                  <div className="skeleton-line skeleton-meta"></div>
                  <div className="skeleton-line skeleton-btn"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="error-state-container">
            <div className="error-icon-wrap">
              <AlertTriangle size={36} />
            </div>
            <h2 className="error-title">Unable to Load Products</h2>
            <p className="error-description">{error}</p>
            <button onClick={fetchProducts} className="btn-retry">
              <RotateCcw size={16} />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="empty-state-container">
            <div className="empty-icon-wrap">
              <PackageX size={40} />
            </div>
            <h2 className="empty-title">No Products Found</h2>
            <p className="empty-description">
              We couldn't find any products matching your current search criteria or selected category filter.
            </p>
            <button onClick={handleResetFilters} className="btn-empty-reset">
              <RotateCcw size={16} />
              <span>Clear All Filters</span>
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
