// import { useState, useEffect } from "react";

// interface UseDebounceSearchOptions {
//   delay?: number;
//   onSearch?: (searchTerm: string) => void;
// }

// interface UseDebounceSearchReturn {
//   searchInput: string;
//   searchTerm: string;
//   setSearchInput: (value: string) => void;
//   setSearchTerm: (value: string) => void;
//   clearSearch: () => void;
// }

// export const useDebounceSearch = (
//   options: UseDebounceSearchOptions = {},
// ): UseDebounceSearchReturn => {
//   const { delay = 200, onSearch } = options;

//   const [searchInput, setSearchInput] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setSearchTerm(searchInput);
//       onSearch?.(searchInput);
//     }, delay);

//     return () => clearTimeout(timer);
//   }, [searchInput, delay, onSearch]);

//   const clearSearch = () => {
//     setSearchInput("");
//     setSearchTerm("");
//   };

//   return {
//     searchInput,
//     searchTerm,
//     setSearchInput,
//     setSearchTerm,
//     clearSearch,
//   };
// };

import { useEffect, useState } from "react";

interface UseDebounceSearchOptions {
  delay?: number;
  initialValue?: string;
}

export const useDebounceSearch = (
  options: UseDebounceSearchOptions = {},
) => {
  const {
    delay = 500,
    initialValue = "",
  } = options;

  const [searchInput, setSearchInput] =
    useState(initialValue);

  const [searchTerm, setSearchTerm] =
    useState(initialValue);
  useEffect(() => {

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchInput(
        initialValue
    );

    setSearchTerm(
        initialValue
    );

  }, [initialValue]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
    }, delay);

    return () => clearTimeout(timer);
  }, [searchInput, delay]);

  return {
    searchInput,
    searchTerm,
    setSearchInput,
  };
};