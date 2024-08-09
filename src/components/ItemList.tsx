import React, { useState, useEffect, useRef, useCallback } from "react";
import { Data } from "../Models/Data";
import ItemListProps from "../Models/ItemListProps";

const ItemList: React.FC<ItemListProps> = ({
  cache,
  currentPage,
  loadNextPage,
  loadPrevPage,
  totalPages,
  isPageChange,
}) => {
  const [listData, setListData] = useState<Data[]>([]);
  const containerRef = useRef<HTMLUListElement>(null);
  const pages = useRef<number[]>([]);
  const previousScrollTop = useRef<number>(0);

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const [loading, setLoading] = useState(false);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const { clientHeight, scrollHeight, scrollTop } = containerRef.current;

      const totalHeight = scrollHeight;
      const pageCount = pages.current.length;
      const pageHeight = totalHeight / pageCount;

      if (scrollTop + clientHeight >= scrollHeight - 1) {
        if (currentPage < totalPages && !loading) {
          setLoading(true);
          loadNextPage();
          setLoading(false);
        }
      } else if (scrollTop + clientHeight > pageHeight * (currentPage - 1)) {
        if (!loading && currentPage < totalPages) {
          setLoading(true);
          loadNextPage();
          setLoading(false);
        }
      } else if (
        scrollTop + pageHeight + 600 * (currentPage - 2) <
        pageHeight * (currentPage - 1)
      ) {
        if (!loading && currentPage > 1) {
          setLoading(true);
          loadPrevPage();
          setLoading(false);
        }
      } else if (scrollTop + pageHeight - 50 < pageHeight) {
        setLoading(true);
        loadPrevPage();
        setLoading(false);
      }

      previousScrollTop.current = scrollTop;
    }
  }, [currentPage, totalPages, loadNextPage, loadPrevPage, loading]);

  const debouncedHandleScroll = useCallback(debounce(handleScroll, 300), [
    handleScroll,
  ]);

  useEffect(() => {
    const fetchData = () => {
      const sortedCache = new Map(
        [...cache.entries()].sort((a, b) => a[0] - b[0])
      );
      const data = sortedCache.get(currentPage) || [];
      setListData((prevData) => [...prevData, ...data]);
    };
    fetchData();

    if (!pages.current.includes(currentPage)) {
      pages.current.push(currentPage);
      pages.current.sort((a, b) => a - b);
    }
  }, [cache, currentPage]);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (currentContainer) {
      currentContainer.addEventListener("scroll", debouncedHandleScroll);
      return () => {
        currentContainer.removeEventListener("scroll", debouncedHandleScroll);
      };
    }
  }, [debouncedHandleScroll]);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const totalHeight = container.scrollHeight;
      const pageCount = pages.current.length;
      const pageHeight = totalHeight / pageCount;
      const currentIndex = pages.current.indexOf(currentPage);

      if (currentIndex !== -1) {
        const newScrollTop = pageHeight * currentIndex;
        container.scrollTo({
          top: newScrollTop,
        });
        previousScrollTop.current = newScrollTop;
      } else {
        container.scrollTo({
          top: container.scrollHeight - 100,
        });
      }
    }
  }, [currentPage]);

  return (
    <ul className="item-list" ref={containerRef}>
      {listData.map((item, index) => (
        <li key={`${item.id}-${index}`} className="item-list-item">
          {item.title}
        </li>
      ))}
    </ul>
  );
};

export default ItemList;
