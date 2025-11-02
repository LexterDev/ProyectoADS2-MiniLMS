/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. ¡ESTA ES LA LÍNEA MÁS IMPORTANTE!
  // Le dice a Tailwind que escanee todos estos archivos en busca de clases.
  content: [
    "./src/**/*.{html,ts}",
  ],
  
  // 2. Habilita el modo oscuro
  darkMode: "class",
  
  // 3. Define nuestros colores personalizados
  theme: {
    extend: {
      colors: {
        "primary": "#7f13ec",
        "background-light": "#f7f6f8",
        "background-dark": "#191022",
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"], // Fuente principal
        "body": ["Roboto", "sans-serif"] // Fuente del cuerpo (si la necesitas)
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem", // <-- Nuestro borde redondeado
        "full": "9999px"
      },
    },
  },

  // 4. Añade los plugins que usamos (como el de formularios)
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

