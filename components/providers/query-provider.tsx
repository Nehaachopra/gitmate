import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import {useState} from "React";

export default function QueryProvider({children}: {children: React.ReactNode}) {
  const [queryClient] = useState(() => new QueryClient());
  return(
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}