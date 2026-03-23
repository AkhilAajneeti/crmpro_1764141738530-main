import { useQuery } from "@tanstack/react-query"
import { fetchLeads } from "services/leads.service"

export const useLeads = () => {
    return useQuery({
        queryKey: ["leads"],
        queryFn: fetchLeads,
        staleTime: 5 * 60 * 1000,
    })
}
