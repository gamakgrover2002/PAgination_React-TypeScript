import React, { useState, useEffect } from "react";
import ItemList from "./components/ItemList";
import Pagination from "./components/Pagination";
import FetchItems from "./api/fetchItems";
import { BaseAPI } from "./api/BaseAPI";
import Options from "./components/Options";
import "./style.css";
import { DataList } from "./Models/DataList";
import Data from "./Models/Data";

const App: React.FC = () => {
  const fetchItems = new FetchItems();
  const [limit, setLimit] = useState<number>(10);
  const [cache, setCache] = useState<Map<number, DataList>>(new Map());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isPageChange, setIsPageChange] = useState<boolean>(false);
  const [oldLimit, setOldLimit] = useState<number>(10);
  const totalData = BaseAPI.totalData;
  const options: number[] = [10, 20, 50, 100];

  const loadNextPage = () => {
    setCurrentPage((prev) => prev + 1);
    setIsPageChange(true);
  };

  const loadPrevPage = () => {
    setCurrentPage((prev) => prev - 1);
    setIsPageChange(true);
  };

  const loadPage = (num: number) => {
    setCurrentPage(num);
    setIsPageChange(true);
  };

  const fetchData = async () => {
    if (cache.has(currentPage)) {
      // Use cached data
      return;
    }
    try {
      const newData: DataList | unknown = await fetchItems.fetchItems(
        (currentPage - 1) * limit,
        limit
      );
      setCache((prevCache) =>
        new Map(prevCache).set(currentPage, newData as DataList)
      );
    } catch (err) {
      setError("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, limit]);

  useEffect(() => {
    if (totalData > 0 && limit > 0) {
      setTotalPages(Math.ceil(totalData / limit));

      // Calculate new currentPage when limit changes
      if (oldLimit !== limit) {
        const newPage = Math.ceil((currentPage * oldLimit) / limit);
        setCurrentPage(newPage);
        setOldLimit(limit);
      }
    }
  }, [cache, limit]);

  return (
    <div className="main-page">
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <ItemList
            cache={cache}
            currentPage={currentPage}
            loadNextPage={loadNextPage}
            loadPrevPage={loadPrevPage}
            totalPages={totalPages}
            isPageChange={isPageChange}
          />
          <Pagination
            loadNextPage={loadNextPage}
            loadPrevPage={loadPrevPage}
            loadPage={loadPage}
            totalPages={totalPages}
            currentPage={currentPage}
          />
          <Options
            limit={limit}
            setLimit={setLimit}
            options={options}
            setOldLimit={setOldLimit}
          />
        </>
      )}
    </div>
  );
};

export default App;
