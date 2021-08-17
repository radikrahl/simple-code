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
            'xsm': '28em',
            'sm': '35em',
            'md': '47em',
            'lg': '60em',
            'xl': '70em'
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
