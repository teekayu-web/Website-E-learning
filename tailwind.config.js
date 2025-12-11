/** @type {import('tailwindcss').Config} */
module.exports = {
  // 👇 เพิ่มบรรทัดนี้เข้าไปครับ (สำคัญมาก!)
  darkMode: 'class', 
  
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}