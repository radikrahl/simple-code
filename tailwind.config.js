module.exports = {
    /*
     * disabled right now, because it needs a main.css available
     * need to fix it in future
     */
    // mode: "jit", // Just-In-Time Compiler
    // purge: ["./**/*.hbs"],
    theme: {
        extend: {},
        screens: {
            'xsm': '30em',
            'sm': '45em',
            'md': '75em',
            'lg': '90em',
            'xl': '120em'
        }
    },
    corePlugins: [
        /*
         * grid plugins
         */
        'gridColumn',
        'gridTemplateColumns',
        'gap',

        /*
         * spacing plugins
         */
        'padding',
        'margin'
    ]
};
