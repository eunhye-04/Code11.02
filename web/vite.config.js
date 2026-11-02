import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 로컬 개발 서버 설정
export default defineConfig({
  plugins: [react()],
})
