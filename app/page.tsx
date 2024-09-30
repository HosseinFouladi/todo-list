"use client";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import ProductList from "./ui/table/product-list";
import { ListProps } from "./ui/table/product-list.type";
export default function Home() {
  
  const [products, setProducts] = useState<Array<ListProps>>();
  const [searchedProducts, setSearchedProducts] = useState<Array<ListProps>>();
  const [price, setPrice] = useState<number>(0);
  const [brand, setBrand] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [filterCount, setFilterCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const perPage = 10;

  useEffect(() => {
    axios
      .get("http://localhost:8000/products")
      .then((data) => {
        setProducts(data.data);
        setSearchedProducts(data.data);
        setIsLoading(false);
        calculateTotlaPages(data.data.length);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const key = e.target.value;
    if (key) {
      const searchedProductsArray = products?.filter(
        (product) =>
          product.name.includes(key) || product.description.includes(key)
      );
      if (searchedProductsArray) setSearchedProducts(searchedProductsArray);
    } else if (products) setSearchedProducts([...products]);
  };

  const filterProducts = () => {
    const filteredProducts = products?.filter((item) => {
      if (price) if (price !== item.price) return false;
      if (category) if (category !== item.category) return false;
      if (brand) if (brand !== item.brand) return false;
      return true;
    });
    if (filteredProducts) {
      setSearchedProducts([...filteredProducts]);
      setFilterCount(filteredProducts.length);
    }
  };
  const resetFilter = () => {
    setPrice(0);
    setBrand("");
    setCategory("");
    if (products) setSearchedProducts([...products]);
  };

  const calculateTotlaPages = (size: number) => {
    const pages = Math.ceil(size / perPage);
    console.log(pages);
    setTotalPages(pages);
  };

  useEffect(() => {
    const startIndex = (page - 1) * perPage;
    const finishIndex = page * perPage;
    if (page !== totalPages)
      setSearchedProducts(products?.slice(startIndex, finishIndex));
    else setSearchedProducts(products?.slice(startIndex));

    console.log(page);
  }, [page]);
  return (
    <div className="flex flex-col justify-center items-center min-h-screen ">
      <div className="w-4/5 flex flex-col">
        <div className="flex flex-col gap-2 p-4">
          <input
            onChange={handleSearch}
            type="text"
            placeholder="search..."
            className="p-2 rounded-lg border border-gray-50"
          />
          <div className="flex items-center justify-between flex-wrap">
            <input
              onChange={(e) => setPrice(+e.target.value)}
              type="number"
              placeholder="filter based on price"
              className="p-2 rounded-lg border border-gray-50"
              name="price"
              value={price}
            />
            <input
              onChange={(e) => setCategory(e.target.value)}
              type="text"
              placeholder="filter based on category"
              className="p-2 rounded-lg border border-gray-50"
              name="category"
              value={category}
            />
            <input
              onChange={(e) => setBrand(e.target.value)}
              type="text"
              placeholder="filter based on brand"
              className="p-2 rounded-lg border border-gray-50"
              name="brand"
              value={brand}
            />
            <button
              className="bg-blue-700 rounded text-white py-1 font-bold text-xl px-4"
              onClick={filterProducts}
            >
              filter
            </button>
            <button
              className=" rounded text-blue-700 py-1 font-bold text-xl px-4"
              onClick={resetFilter}
            >
              reset filter
            </button>
          </div>
        </div>
        {!isLoading ? (
          <table className="border-2 border-black p-8 shadow rounded-2xl overflow-hidden">
            <thead>
              <tr>
                <th className="p-3">name</th>
                <th>description</th>
                <th>price</th>
                <th>category</th>
                <th>brand</th>
              </tr>
            </thead>
            <tbody>
              {searchedProducts && searchedProducts.length > 0 ? (
                searchedProducts?.map((product) => {
                  return <ProductList {...product} key={product.id} />;
                })
              ) : (
                <h2 className="p-4 text-center text-red-400 text-lg">
                  products not found
                </h2>
              )}
            </tbody>
          </table>
        ) : (
          <h2 className="text-lg mx-auto text-blue-500">data fetching....</h2>
        )}
        <div className="my-4 flex items-center justify-center gap-2">
          {Array.from(Array(totalPages), (e, i) => {
            return (
              <button
                key={i}
                onClick={() => setPage(+i + 1)}
                className={
                  "rounded border p-2 text-sm" +
                  (page === i + 1
                    ? " bg-gray-900 text-white"
                    : "bg-transparent ")
                }
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <div className="p-4">
          {filterCount > 0 && (price || brand || category) && (
            <span className="">
              total count of filtered items:{filterCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
