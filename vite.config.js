import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || "/nt-lunch-duty",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Kanit", "sans-serif"], // ใช้แทน font-sans เดิม
      },
    },
  },
  plugins: [react(), tailwindcss()],
})
