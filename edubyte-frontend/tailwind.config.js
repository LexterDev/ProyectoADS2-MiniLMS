/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Asegúrate de que Tailwind sepa si estás usando modo oscuro
  darkMode: "class", // O 'media' si lo prefieres

  // 2. ¡CRÍTICO! Dile a Tailwind que escanee tus archivos .html y .ts
  // para encontrar las clases que usas.
  content: [
    "./src/**/*.{html,ts}", 
  ],
  
  // 3. Define los colores y fuentes de tu diseño
  theme: {
    extend: {
      colors: {
        "primary": "#7f13ec",
        "background-light": "#f7f6f8",
        "background-dark": "#191022",
      },
      fontFamily: {
        // Asigna 'Manrope' como la fuente "display"
        "display": ["Manrope", "sans-serif"] 
      },
    },
  },

  // 4. Añade los plugins que necesites (tu package.json tiene @tailwindcss/postcss)
  // Asegúrate de tener también @tailwindcss/forms si usarás formularios nativos
  plugins: [
    // require('@tailwindcss/forms'), // Descomenta si lo instalas
  ],
}
