import { jobTitleRouter } from "trigify-test/server/api/routers/jobTitle";
import { createCallerFactory, createTRPCRouter } from "trigify-test/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
// export const appRouter = createTRPCRouter({
//   post: postRouter,
// });

export const appRouter = createTRPCRouter({
  jobTitle: jobTitleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
