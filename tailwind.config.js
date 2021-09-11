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
            'xsm': '32rem',
            'sm': '48rem',
            'md': '64rem',
            'lg': '80rem',
            'xl': '90rem'
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
        'margin',

        /*
         * typography
        */
        'textTransform',
        'fontWeight'
    ]
};
