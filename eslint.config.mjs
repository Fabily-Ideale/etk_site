export default [
  {
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        CustomEvent: "readonly",
        localStorage: "readonly",
        navigator: "readonly",
        URL: "readonly",
        requestAnimationFrame: "readonly",
        AbortSignal: "readonly"
      }
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "error",
      "no-redeclare": "error",
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-unreachable": "error",
      "no-constant-condition": "error",
      "no-empty": "error",
      "no-self-assign": "error",
      "use-isnan": "error",
      "valid-typeof": "error",
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: "error",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error"
    }
  }
];
