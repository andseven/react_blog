import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // optimizeDeps 是开发环境下的配置，与打包无关，可以保留
  optimizeDeps: {
    include: [
      "antd/es/menu",
      "@ant-design/icons/MailOutlined",
      "@ant-design/icons/AppstoreOutlined",
      "@ant-design/icons/SettingOutlined",
    ],
  },

  // 关键：修改 base 配置
  // 将 "/<YOUR_REPO_NAME>/" 替换成你的仓库名
  base: "/react_blog", 

  build: {
    outDir: "dist", // 打包文件的输出目录
  },
});