import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

export const PaginationButtons = ({ totalPages, currentPage, onPageChange }: {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}) => {
    const pageNumbers = generatePageNumbers(totalPages, currentPage);
    const searchParams = new URLSearchParams(useSearchParams().toString());
    const router = useRouter();

    return totalPages && totalPages > 7 ? (
        <div className="flex flex-row flex-wrap space-x-2 text-black mt-2 text-black items-right">
            {/* Page Numbers */}
            {pageNumbers.map((num, index) =>
                num === "..." ? (
                    <span key={index} className="px-3 py-1 text-white">...</span>
                ) : (
                    <button
                        key={index}
                        onClick={() => {
                            onPageChange(num)
                            // setCurrentPage(pageNumber - 1)
                            searchParams.set("page", (num - 1).toString());
                            router.push(`?${searchParams.toString()}`);
                        }}
                        className={`px-3 py-1 border rounded ${num - 1 === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    >
                        {num}
                    </button>
                )
            )}
        </div>
    )
        : null
};

/** Pagination logic: Shows first & last pages, and uses '...' where necessary */
const generatePageNumbers = (totalPages: number, currentPage: number): (number | "...")[] => {
    const maxVisible = 3; // Show 3 pages before/after currentPage
    const pageNumbers: (number | "...")[] = [];

    if (totalPages <= 7) {
        // Show all pages if small number of pages
        for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
        pageNumbers.push(1); // Always show first page

        // Show "..." if skipping numbers
        if (currentPage > maxVisible + 2) pageNumbers.push("...");

        // Generate middle page numbers
        for (let i = Math.max(2, currentPage - maxVisible); i <= Math.min(totalPages - 1, currentPage + maxVisible); i++) {
            pageNumbers.push(i);
        }

        // Show "..." if skipping numbers
        if (currentPage < totalPages - maxVisible - 1) pageNumbers.push("...");

        pageNumbers.push(totalPages); // Always show last page
    }

    return pageNumbers;
};
