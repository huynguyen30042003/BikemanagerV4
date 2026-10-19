"use client";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function SearchBar({ defaultSearch }: { defaultSearch: string }) {
  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: 400,
    initialValue: defaultSearch, // SỬA: Truyền defaultSearch vào đây
  });

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  useEffect(() => {
    // SỬA: Dùng URLSearchParams để format đúng định dạng ?key=value
    const params = new URLSearchParams(searchParams.toString());
    const currentUrlSearch = searchParams.get("search") || "";
    if (searchTerm === currentUrlSearch) {
      return;
    }
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }

    replace(`${pathname}?${params.toString()}`);
  }, [searchTerm, pathname, replace, searchParams]);

  return (
    <input
      placeholder="Tìm kiếm..."
      value={searchInput}
      onChange={(e) => setSearchInput(e.target.value)}
    />
  );
}
