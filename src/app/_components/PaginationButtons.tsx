import { type SetStateAction } from "react";

import { useRouter, useSearchParams } from "next/navigation";

export const PaginationButtons = ({ total, currentPage, setCurrentPage }:
    { total: number, currentPage: number | string, setCurrentPage: (value: SetStateAction<number>) => void }) => {
    const pageSize = 3
    const searchParams = new URLSearchParams(useSearchParams().toString());
    const router = useRouter();


    return total && total > pageSize ?
        <div className="flex flex-row space-x-2 text-black mt-2 items-right">
            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
            {[...Array(Math.round(total / pageSize))].map((_, index) => {
                const pageNumber = index + 1;

                return (
                    <button
                        type="button"
                        key={pageNumber}
                        onClick={() => {
                            setCurrentPage(pageNumber - 1)
                            searchParams.set("page", (pageNumber - 1).toString());
                            router.push(`?${searchParams.toString()}`);
                        }}
                        className={`w-[2rem] h-[2rem] border rounded ${currentPage === pageNumber - 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                            }`}
                    >
                        {pageNumber}
                    </button>
                );
            })}
        </div> : null

}