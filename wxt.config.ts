import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
	srcDir: "src",
	publicDir: "src/public",
	vite: () => ({
		plugins: [vanillaExtractPlugin()],
	}),
	modules: ["@wxt-dev/module-react"],
});
