import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { fetchIndustries, fetchSources, fetchStatus } from 'services/others.service';

export const useMetaData = () => {
    return useQuery({
        queryKey: ["meta"],
        queryFn: async () => {
            const [sources, status, industries] = await Promise.all([
                fetchSources(),
                fetchStatus(),
                fetchIndustries(),
            ]);

            return {
                sources: sources.options || [],
                status: status.options || [],
                industries: industries.options || [],
            };
        },
        staleTime: 10 * 60 * 1000,
    });
}
