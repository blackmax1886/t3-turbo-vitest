import { defineConfig } from "vitest/config";

export const base = defineConfig({
    test: {
        globals: true,
        reporters: ["default"],
        include: ["**/*.test.{ts,tsx}"],
        coverage: {
            enabled: true,
            provider: "v8",
            reportsDirectory: "./.cache/coverage",
        }
    }
})

export default base;
