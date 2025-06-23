import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { name } from "./package.json";

import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [react(), basicSsl()],
  base: `/${name}/`,
  server: {
    host: true,
    https: true,
  },
});
