import { Suspense } from "react";
import { Search } from "trigify-test/app/_components/Search";
import { HydrateClient } from "trigify-test/trpc/server";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">
            Trigify <span className="text-[hsl(280,100%,70%)]">Job</span> Titles
          </h1>
          <ClerkProvider>
            <header className="flex justify-end items-center p-4 gap-4 h-16">
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>

            <Suspense>
              <Search />
            </Suspense>
          </ClerkProvider>
        </div>
      </main>
    </HydrateClient>
  );
}
