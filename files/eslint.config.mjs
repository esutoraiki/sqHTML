// eslint.config.js
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2018, // puedes usar "latest"
      sourceType: "module",
      globals: {
        ...globals.browser,
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
      }
    },
    rules: {
      quotes: ["warn", "double"],
      "semi-spacing": ["error", { before: false, after: true }],
      semi: ["warn", "always"],
      "no-multi-spaces": ["error", {
        exceptions: {
          Property: true,
          VariableDeclarator: true,
          ImportDeclaration: true
        }
      }],
      "comma-spacing": ["error", { before: false, after: true }],
      "block-spacing": ["warn", "always"],
      "no-trailing-spaces": "warn",
      "no-whitespace-before-property": "error",
      "space-before-blocks": "error",
      "space-in-parens": ["error", "never"],
      "space-before-function-paren": ["error", {
        anonymous: "always",
        named: "never",
        asyncArrow: "always"
      }],
      "space-unary-ops": ["error", { words: true, nonwords: false }],
      "spaced-comment": ["warn", "always", {
        line: { exceptions: ["-", "*"] },
        block: { exceptions: ["-", "*"] }
      }],
      "no-spaced-func": "error",
      "keyword-spacing": ["warn", { before: true }],
      "space-infix-ops": "warn"
    }
  }
];

