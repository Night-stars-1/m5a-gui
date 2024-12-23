// electron.vite.config.ts
import path, { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
var __electron_vite_injected_dirname = "H:\\Project\\Github\\m5a-gui";
function setVersion() {
  const packageJson = JSON.parse(readFileSync(resolve(__electron_vite_injected_dirname, "package.json"), "utf-8"));
  const appVersion = packageJson.version;
  const envPath = resolve(__electron_vite_injected_dirname, ".env");
  let envContent = readFileSync(envPath, "utf-8");
  const versionLine = `VITE_VERSION=${appVersion}
`;
  envContent = envContent.replace(/VITE_VERSION=.*/g, versionLine.trim());
  writeFileSync(envPath, envContent, "utf-8");
}
function configureOcrModel() {
  const ocrAssetsDir = path.join("resources", "MaaCommonAssets", "OCR");
  if (!existsSync(ocrAssetsDir)) {
    console.log('\u8BF7\u5B8C\u6574\u514B\u9686\u672C\u4ED3\u5E93\uFF0C\u4E0D\u8981\u6F0F\u6389 "--recursive"\uFF0C\u4E5F\u4E0D\u8981\u4E0B\u8F7D zip \u5305\uFF01');
    process.exit(1);
  }
  const ocrDir = path.join(__electron_vite_injected_dirname, "resources", "model", "ocr");
  if (!existsSync(ocrDir)) {
    mkdirSync(ocrDir, { recursive: true });
    cpSync(
      path.join(ocrAssetsDir, "ppocr_v4", "zh_cn"),
      ocrDir,
      { recursive: true, force: true }
      // recursive 确保递归复制，force 覆盖现有文件
    );
  } else {
    console.log("\u627E\u5230\u73B0\u6709OCR\u76EE\u5F55\uFF0C\u8DF3\u8FC7\u9ED8\u8BA4OCR\u6A21\u578B\u5BFC\u5165");
  }
}
setVersion();
configureOcrModel();
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@stores": resolve("src/renderer/src/plugins/pinia")
      }
    },
    plugins: [
      vue(),
      vuetify({ autoImport: true }),
      AutoImport({
        imports: ["vue", "vue-router", "pinia"],
        dts: resolve("src/renderer/src/types/auto-imports.d.ts")
      }),
      Components({
        dirs: [resolve("src/renderer/src/components")],
        dts: resolve("src/renderer/src/types/components.d.ts")
      })
    ]
  }
});
export {
  electron_vite_config_default as default
};
