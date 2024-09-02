
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import { setCategories, setProducts, setChecked } from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector((state) => state.shop);

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
      const filteredProducts = filteredProductsQuery.data.filter(
        (product) =>
          product.price.toString().includes(priceFilter) ||
          product.price === parseInt(priceFilter, 10)
      );
      dispatch(setProducts(filteredProducts));
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...new Set(
      filteredProductsQuery.data
        ?.map((product) => product.brand)
        .filter((brand) => brand !== undefined)
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar for Filters */}
        <div className="bg-gray-800 text-white w-full md:w-1/4 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Filter by Categories</h2>
          <div className="space-y-4">
            {categories?.map((c) => (
              <div key={c._id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${c._id}`}
                  onChange={(e) => handleCheck(e.target.checked, c._id)}
                  className="w-4 h-4 text-pink-600 bg-gray-700 border-gray-600 rounded focus:ring-pink-500"
                />
                <label
                  htmlFor={`category-${c._id}`}
                  className="ml-2 text-sm"
                >
                  {c.name}
                </label>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold mt-6 mb-4">Filter by Brands</h2>
          <div className="space-y-4">
            {uniqueBrands?.map((brand) => (
              <div key={brand} className="flex items-center">
                <input
                  type="radio"
                  id={`brand-${brand}`}
                  name="brand"
                  onChange={() => handleBrandClick(brand)}
                  className="w-4 h-4 text-pink-400 bg-gray-700 border-gray-600 rounded focus:ring-pink-500"
                />
                <label
                  htmlFor={`brand-${brand}`}
                  className="ml-2 text-sm"
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-semibold mt-6 mb-4">Filter by Price</h2>
          <input
            type="text"
            placeholder="Enter Price"
            value={priceFilter}
            onChange={handlePriceChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Reset
          </button>
        </div>

        {/* Products Display */}
        <div className="w-full md:w-3/4 p-4">
          <h2 className="text-xl font-semibold mb-4">
            {products.length} Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.length === 0 ? (
              <Loader />
            ) : (
              products?.map((p) => (
                <ProductCard key={p._id} p={p} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
