import { api } from "trigify-test/trpc/react";

export const searchByName = (query: string, page: string) => api.jobTitle.searchByName.useQuery({ query, page }, { enabled: !!query });

export const search = (query: string, enabled: boolean) => api.jobTitle.search.useQuery({ query }, { enabled });