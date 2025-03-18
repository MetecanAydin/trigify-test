"use client";

import { useState } from "react";

// import { api } from "trigify-test/trpc/react";
import { search, searchByName } from "../api/queries";
import { useRouter, useSearchParams } from "next/navigation";
import { PaginationButtons } from "./PaginationButtons";
import { Badge } from "trigify-test/components/ui/badge";
import { Button } from "trigify-test/components/ui/button";
import { Input } from "trigify-test/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import { Card, CardContent } from "trigify-test/components/ui/card";

export function Search() {
  // const utils = api.useUtils();
  const [name, setName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const searchParams = new URLSearchParams(useSearchParams().toString());
  const searchJobTitles = searchByName(searchParams?.get('jobTitle') ?? '', searchParams?.get('page') ?? '0')
  const searches = search(name)
  const router = useRouter()

  const { isSignedIn } = useAuth();


  return (
    <div className="w-full max-w-[30rem] relative">
      {isSignedIn ?
        <><form
          onSubmit={async (e) => {
            e.preventDefault();
            setIsFocused(false)
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
              setIsFocused(true)
            }}
            className="w-full px-4 py-2 text-black bg-white"
            disabled={searchJobTitles.isLoading}
            onBlur={() => setIsFocused(false)}
          />
          <Button
            type="submit"
            className=" bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
            disabled={searchJobTitles.isLoading}
          >
            Search
          </Button>

        </form>
          {searches.data && isFocused && <div className="absolute w-full mt-2">
            <Card className="rounded-sm">
              <CardContent>
                <ul className="mt-2">
                  {searches.data?.map(d =>
                    <li key={d.id}

                      onClick={e => {
                        setName(e.currentTarget.textContent!)
                        searchParams.set("jobTitle", e.currentTarget.textContent!);
                        router.push(`?${searchParams.toString()}`);
                      }}
                      className="p-1 cursor-pointer hover:bg-sky-100"
                    >
                      {d.name}
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
          }


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

          </section></>
        : <div className="pt-4 text-center">Sign in to Search Jobs</div>}
    </div>
  );
}
