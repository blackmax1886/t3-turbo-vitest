
import { defineConfig, mergeConfig } from "vitest/config"
import baseConfig, { base } from "./base"

export default mergeConfig(
    baseConfig,
    defineConfig({
        test: {
            environment: "node"
        }
    })
)
