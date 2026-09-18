import { createContext, useState, useContext } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilters, setTypeFilters] = useState([]);
  const [vaccinationFilter, setVaccinationFilter] = useState("All");

  const toggleTypeFilter = (type) => {
    setTypeFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        typeFilters,
        toggleTypeFilter,
        vaccinationFilter,
        setVaccinationFilter,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);