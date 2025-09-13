import path from "node:path"
import baseConfig from "./base"
import { defineConfig, mergeConfig } from "vitest/config"
import react from "@vitejs/plugin-react-swc"

export default mergeConfig(
    baseConfig,
    defineConfig({
        plugins: [react()],
        test: {
            environment: "jsdom",
            setupFiles: [path.resolve(process.cwd(), "__tests__/react-setup.ts")],
        },
        resolve: {
            alias: {
                "~": path.resolve("./src")
            }
        }
    })
)
