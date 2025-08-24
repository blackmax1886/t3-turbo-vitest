import { createTRPCMsw, httpLink } from "msw-trpc";
import SuperJSON from "superjson";

import type { AppRouter } from "../root";

export { setupServer } from "msw/node";

export const trpcMsw = createTRPCMsw<AppRouter>({
  transformer: { input: SuperJSON, output: SuperJSON },
  links: [httpLink({ url: "http://localhost:3000/api/trpc" })],
});
