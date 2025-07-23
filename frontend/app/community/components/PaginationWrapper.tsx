// app/community/components/PaginationWrapper.tsx
"use client";

import { useState } from "react";
import Pagination from "./Pagination";

interface Props {
  totalPages: number;
  initialPage?: number;
}

export default function PaginationWrapper({ totalPages, initialPage = 1 }: Props) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  );
}
