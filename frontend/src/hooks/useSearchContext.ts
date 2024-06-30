import { useContext } from "react";
import { SearchContext, SearchContextType } from "../contexts/SearchContext";

export const useSearchContext = () => {
    const context = useContext(SearchContext);
    return context as SearchContextType;
};
