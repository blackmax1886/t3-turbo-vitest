import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpLink } from "@trpc/client";
import SuperJSON from "superjson";

import type { AppRouter } from "@acme/api";
import { render } from "@acme/vitest";

import { createQueryClient } from "~/trpc/query-client";
import { TRPCProvider } from "~/trpc/react";

export function MockTRPCReactProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = createQueryClient();

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpLink({
          transformer: SuperJSON,
          url: "http://localhost:3000/api/trpc",
          headers() {
            const headers = new Headers();
            headers.set("x-trpc-source", "nextjs-react");
            return headers;
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}

export const renderWithTRPC = (children: React.ReactNode) => {
  return render(<MockTRPCReactProvider>{children}</MockTRPCReactProvider>);
};
