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
};

module.exports = config;
