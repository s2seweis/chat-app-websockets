module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react'],
  rules: {
    // General ESLint Rules
    'indent': ['error', 2],
    // 'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline'],
      
    // React Rules
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
      
    // Additional Common Rules (Add more rules as needed)
    'no-unused-vars': 'error',
    'no-console': 'warn',
    'no-const-assign': 'error',
    'no-dupe-class-members': 'error',
    'no-duplicate-imports': 'error',
    'no-empty': 'error',
    'no-extra-semi': 'error',
    'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0 }],
    'no-redeclare': 'error',
    'no-this-before-super': 'error',
    'no-undef': 'error',
    'no-unreachable': 'error',
    'no-use-before-define': ['error', { 'functions': false, 'classes': true, 'variables': true }],
  },
};