import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { fetchLeads, fetchNewLeads } from "services/leads.service"

export const useLeads = ({limit,page}) => {
    return useQuery({
        queryKey: ["leads",limit,page],
        queryFn: ()=>fetchLeads({limit,page}),
        placeholderData: keepPreviousData,
    })
}
export const useNewLeads = () => {
    return useQuery({
        queryKey: ["leads"],
        queryFn: ()=>fetchNewLeads(),
        placeholderData: keepPreviousData,
    })
}
