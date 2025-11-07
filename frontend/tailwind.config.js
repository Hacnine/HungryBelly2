/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.{js,ts}",
  ],
  theme: {
    extend: {
      fontSize: {
        xs: ['12px', '16px'],
      },
      backgroundImage: {
        'hero-bg':  "url('/src/assets/images/background/bg2.svg')",
        'hero-sm':  "url('/src/assets/images/background/bg4.svg')",
        'fooditem': "url('/src/assets/images/background/bg3.svg')",
        'booking': "url('/src/assets/images/background/booking.svg')",
        'commentary': "url('/src/assets/images/background/commentarybg.svg')",
        'commenttext': "url('/src/assets/images/background/commentbg.svg')",
        'footer': "url('/src/assets/images/background/footer.png')",
        'blog': "url('/src/assets/images/background/blogbg.jpg')",
        'client': "url('/src/assets/images/background/clientbg.jpg')",
        'contact': "url('/src/assets/images/background/contactbg.jpg')",
        'portfolio': "url('/src/assets/images/background/portfolibg.jpg')",
        'about': "url('/src/assets/images/background/aboutbg.jpg')",
        'chef': "url('/src/assets/images/background/chef.jpg')",
        'contactus': "url('/src/assets/images/background/contactus.jpg')",
        'customersay': "url('/src/assets/images/background/customersay.jpg')",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        bebus: ["Bebas Neue", "sans-serif"]
      },
      colors: {
        "customred": "#f24122",
        "ligherpink": "#faf7f2",
        "admin-orange": "#fc9a30"
      },
      screens: {
        "sc-390": "390px",
        "sc-414": "410px",
        "sc-430": "430px",
        "max-sm": "778px",
        "min-sm": "500px"
      },
    },
  },
  plugins: [],
}
