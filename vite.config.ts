import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["antd/es/menu", "@ant-design/icons/MailOutlined", "@ant-design/icons/AppstoreOutlined", "@ant-design/icons/SettingOutlined"],
  },
})
