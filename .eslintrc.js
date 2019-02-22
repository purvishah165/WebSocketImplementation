module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
      '@vue/standard',
      // https://github.com/standard/standard/blob/master/docs/RULES-en.md
      'standard'
  ],
    // required to lint *.vue files
  plugins: [
      'vue'
  ],
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
   'generator-star-spacing': 'off',
   'no-useless-escape': 'off',
   // allow debugger during development
   'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
