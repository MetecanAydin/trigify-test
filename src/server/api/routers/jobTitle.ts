import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "trigify-test/server/api/trpc";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const prisma = new PrismaClient();

const pageSize = 10;

export const jobTitleRouter = createTRPCRouter({

    // Search titles by name (partial match)
    search: publicProcedure
        .input(z.object({ query: z.string() }))
        .query(async ({ input }) => {
            try {
                const titles = await prisma.title.findMany({
                    where: {
                        name: {
                            contains: input.query,
                            mode: 'insensitive'
                        }
                    },
                    take: 8,
                    orderBy: { pdlCount: 'desc' },
                });
                return titles
            } catch (error) {
                console.error("Database query failed:", error);
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to fetch titles",
                });
            }
        }),

    // Search titles by name (partial match)
    searchByName: publicProcedure
        .input(z.object({ query: z.string(), page: z.string() }))
        .query(async ({ input }) => {
            const result = await prisma.$transaction([
                prisma.title.count({
                    where: {
                        name: {
                            contains: input.query,
                            mode: 'insensitive'
                        }
                    },
                }),
                prisma.title.findMany({
                    where: {
                        name: {
                            contains: input.query,
                            mode: 'insensitive'
                        }
                    },
                    include: {
                        relatedTitles: {
                            include: {
                                relatedTitle: true
                            }
                        }
                    },
                    orderBy: { pdlCount: 'desc' },
                    take: pageSize,
                    skip: input.page ? pageSize * Number(input.page) : 0,
                })
            ])
            return {
                total: result[0],
                results: result[1]
            }
        }),
});
