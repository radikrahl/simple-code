'use strict';
const config = {
    root: true,
    extends: ['prettier'],
    plugins: ['prettier'],
    rules: {
        quotes: ['error', 'single'],
    },
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    globals: {
        hljs: 'readonly',
    },
    "parserOptions": {
        "ecmaVersion": "2015",
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
};

module.exports = config;
