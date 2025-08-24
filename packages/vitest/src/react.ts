import path from "node:path"
import { fileURLToPath } from "node:url"
import baseConfig from "./base"
import { defineConfig, mergeConfig } from "vitest/config"
import react from "@vitejs/plugin-react-swc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default mergeConfig(
    baseConfig,
    defineConfig({
        plugins: [react()],
        test: {
            environment: "jsdom",
            setupFiles: [path.resolve(__dirname, "react-setup.ts")],
        },
        resolve: {
            alias: {
                "~": path.resolve("./src")
            }
        }
    })
)
