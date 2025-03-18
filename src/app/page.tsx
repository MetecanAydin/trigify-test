import { Suspense } from "react";
import { Search } from "trigify-test/app/_components/Search";
import { HydrateClient } from "trigify-test/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[4rem]">
            Trigify <span className="text-[hsl(280,100%,70%)]">Job</span> Titles
          </h1>
          <Suspense>
            <Search />
          </Suspense>
        </div>
      </main>
    </HydrateClient>
  );
}
