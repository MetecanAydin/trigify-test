"use client";

import { useState } from "react";

// import { api } from "trigify-test/trpc/react";
import { searchByName } from "../api/queries";
import { useRouter, useSearchParams } from "next/navigation";
import { PaginationButtons } from "./PaginationButtons";
import { Badge } from "trigify-test/components/ui/badge";

export function Search() {
  // const utils = api.useUtils();
  const [name, setName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const searchParams = new URLSearchParams(useSearchParams().toString());

  const searchJobTitles = searchByName(searchParams?.get('jobTitle') ?? '', searchParams?.get('page') ?? '0')

  const router = useRouter()

  return (
    <div className="w-full max-w-[30rem]">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          searchParams.set("jobTitle", name);
          router.push(`?${searchParams.toString()}`);

        }}
        className="gap-2 flex flex-row"
      >
        <input
          type="text"
          placeholder="Search job titles..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 text-black"
          disabled={searchJobTitles.isLoading}
        />
        <button
          type="submit"
          className=" bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={searchJobTitles.isLoading}
        >
          Search
        </button>
      </form>

      <section className="">
        <div className="bg-white h-[400px] mt-4 text-black flex justify-center">
          {searchJobTitles.isLoading ?
            <div className="animate-pulse h-full text-center pt-4">Loading...</div>
            :
            searchJobTitles.data && searchJobTitles.data.results.length > 0 ?
              <ul className="text-left px-4 pt-4 flex flex-col w-full overflow-auto">
                {searchJobTitles.data.results?.map(t => <li className="bg-sky-100 pl-4 py-2 mb-4" key={t.id}>
                  <div>Title: <Badge className="p-1 hover:bg-[hsl(280,55%,40%)] bg-[hsl(280,55%,40%)]">{t.name}</Badge></div>
                  <div className="mt-4 flex-wrap flex flex-row">
                    <p className="mb-1">Related Titles:</p>
                    <br />
                    <div>
                      {t.relatedTitles.map(rt =>
                        <Badge
                          key={rt.id}
                          onClick={e => {
                            setName(e.currentTarget.textContent!)
                            searchParams.set("jobTitle", e.currentTarget.textContent!);
                            searchParams.set("page", '0');
                            router.push(`?${searchParams.toString()}`);
                          }}
                          className="mr-2 mb-2 p-1 cursor-pointer">{rt.relatedTitle.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </li>)}
              </ul>
              : <div className="pt-4">No data</div>
          }
        </div>

        <PaginationButtons
          total={searchJobTitles.data?.total ?? 0}
          currentPage={Number(searchParams?.get('page')) ?? currentPage}
          setCurrentPage={setCurrentPage}
        />

      </section>
    </div>
  );
}
