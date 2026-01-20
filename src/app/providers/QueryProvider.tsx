import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

export default function QueryProvider({children}: {children: React.ReactNode}) {
    const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 1000 * 60 * 5, // 5 minutes
            refetchInterval: 1000 * 60 * 5, // 5 minutes
          }
        }
      })
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}