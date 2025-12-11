/** @type {import('tailwindcss').Config} */
export default {
  // บรรทัดนี้สำคัญที่สุดครับ ต้องมีเพื่อเปิดโหมด Manual Dark Mode
  darkMode: 'class', 
  
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}