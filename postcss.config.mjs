// /** @type {import('postcss-load-config').Config} */
// const config = {
//   plugins: {
//     'tailwindcss/nesting': {},
//     tailwindcss: {},
//     autoprefixer: {}
//   }
// }

// export default config


/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'postcss-nesting': {},
    tailwindcss: {},
    autoprefixer: {}
  }
}

export default config
