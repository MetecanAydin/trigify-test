"use client";

import { useRef, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

import { search, searchByName } from "../api/queries";
import { PaginationButtons } from "./PaginationButtons";
import { Badge } from "trigify-test/components/ui/badge";
import { Button } from "trigify-test/components/ui/button";
import { Input } from "trigify-test/components/ui/input";
import { Card, CardContent } from "trigify-test/components/ui/card";
import { useDebounce } from "trigify-test/lib/utils";

export function Search() {
  const [name, setName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const ref = useRef<HTMLInputElement>(null);
  const searchParams = new URLSearchParams(useSearchParams().toString());
  const searchJobTitles = searchByName(searchParams?.get('jobTitle') ?? '', searchParams?.get('page') ?? '0')

  const debouncedValue = useDebounce(name, 300)

  const searches = search(debouncedValue, document.activeElement === ref.current)
  const router = useRouter()
  const { isSignedIn } = useAuth();

  return (
    <div className="w-full relative">
      {isSignedIn ?
        <>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              searchParams.set("jobTitle", name);
              router.push(`?${searchParams.toString()}`);
            }}
            className="gap-2 flex flex-row"
          >
            <Input
              type="text"
              placeholder="Search job titles..."
              value={name}
              onChange={(e) => {
                setName(e.target.value)
              }}
              ref={ref}
              className="w-full px-4 py-2 text-black bg-white"
              disabled={searchJobTitles.isLoading}
            />

            <Button
              type="submit"
              className=" bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
              disabled={searchJobTitles.isLoading}
            >
              Search
            </Button>



            {searches.isLoading && <Card className="absolute rounded-sm w-full mt-2 top-[3rem]"><p className="p-1">Loading...</p></Card>}

            {searches.data && document.activeElement === ref.current &&
              <Card className="absolute w-full mt-2 top-[3rem] rounded-sm">
                {searches.data.length === 0 ? <p className="p-2">No results with: {name}</p> :
                  <CardContent>
                    <ul className="mt-2">
                      {searches.data?.map(d =>
                        <li key={d.id}
                          onClick={e => {
                            setName(e.currentTarget.textContent ?? '')
                            searchParams.set("jobTitle", e.currentTarget.textContent ?? '');
                            router.push(`?${searchParams.toString()}`);
                          }}
                          className="p-1 cursor-pointer"
                        >
                          <Button type="submit">{d.name}</Button>
                        </li>
                      )}
                    </ul>
                  </CardContent>
                }
              </Card>
            }
          </form>


          <section>
            <div className="bg-white min-h-[100px] mt-4 text-black flex justify-center">
              {searchJobTitles.isLoading ?
                <div className="animate-pulse h-full text-center pt-4">Loading...</div>
                :
                searchJobTitles.data && searchJobTitles.data.results.length > 0 ?
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {searchJobTitles.data.results?.map(t =>
                      <li className="" key={t.id}>
                        <Card className="bg-sky-100 pl-4 py-2 mb-4 h-full rounded-sm">

                          <div className="flex flex-row">
                            <Badge
                              className="p-1 h-fit cursor-pointer hover:bg-[hsl(280,55%,40%)] bg-[hsl(280,55%,40%)]"
                              onClick={e => {
                                setName(e.currentTarget.textContent ?? '')
                                searchParams.set("jobTitle", e.currentTarget.textContent ?? '');
                                searchParams.set("page", '0');
                                router.push(`?${searchParams.toString()}`);
                              }}
                            >
                              {t.name}
                            </Badge>
                            <p className="ml-auto pr-2">{t.pdlCount}</p>
                          </div>
                          <div className="mt-4 flex-wrap flex flex-row">
                            {t.relatedTitles.length > 0 ?
                              <>
                                <p className="mb-1">Related Titles:</p>
                                <br />
                                <div>
                                  {t.relatedTitles.map(rt =>
                                    <Badge
                                      key={rt.id}
                                      onClick={e => {
                                        setName(e.currentTarget.textContent ?? '')
                                        searchParams.set("jobTitle", e.currentTarget.textContent ?? '');
                                        searchParams.set("page", '0');
                                        router.push(`?${searchParams.toString()}`);
                                      }}
                                      className="mr-2 mb-2 p-1 cursor-pointer">{rt.relatedTitle.name}
                                    </Badge>
                                  )}
                                </div>
                              </>
                              : <p className="mb-1">No Related Titles</p>}
                          </div>
                        </Card>
                      </li>
                    )}
                  </ul>
                  : <div className="pt-4">No data</div>
              }
            </div>

            {searchJobTitles.data?.total &&
              <PaginationButtons
                totalPages={Math.round(searchJobTitles.data?.total / 10) ?? 0}
                currentPage={Number(searchParams?.get('page')) ?? currentPage}
                onPageChange={setCurrentPage}
              />}

          </section>
        </>
        : <div className="pt-4 text-center">Sign in to Search Jobs</div>}
    </div>
  );
}
