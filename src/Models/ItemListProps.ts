import Data from "./Data";
import { DataList } from "./DataList";
interface ItemListProps {
  cache: Map<number, Data[]>;
  currentPage: number;
  loadNextPage: () => void;
  loadPrevPage: () => void;
  totalPages: number;
  isPageChange: boolean;
}
export default ItemListProps;
