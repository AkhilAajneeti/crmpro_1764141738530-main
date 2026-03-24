import { useQuery } from "@tanstack/react-query"
import { fetchAccounts } from "services/account.service"

export const useAccounts = () => {
    return useQuery({
        queryKey: ["accounts"],
        queryFn: fetchAccounts,
        staleTime: 5 * 60 * 1000,
    })
}
