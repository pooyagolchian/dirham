import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	base: "/dirham/",
	plugins: [tailwindcss(), react()],
	server: {
		port: 3000,
		open: true,
	},
});
