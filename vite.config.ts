// @webtoon/psd
// Copyright 2021-present NAVER WEBTOON
// MIT License

import {defineConfig} from "vite";

export default defineConfig({
  base: "./",
  publicDir: "./statics",
  server: {
    port: 4200,
  },
  build: {
    outDir: "./dist",
    emptyOutDir: true,
  },
});
