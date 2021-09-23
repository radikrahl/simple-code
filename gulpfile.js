const { series, watch, src, dest, parallel } = require('gulp');
const pump = require('pump');

// gulp plugins and utils
var livereload = require('gulp-livereload');
var postcss = require('gulp-postcss');
var zip = require('gulp-zip');
var uglify = require('gulp-uglify');
var gulpUtil = require('gulp-util');
var concat = require('gulp-concat');

// general utils
var beeper = require('beeper');
var merge = require('merge-stream');
const fs = require('fs');

// postcss plugins
var autoprefixer = require('autoprefixer');
var colorFunction = require('postcss-color-mod-function');
var cssnano = require('cssnano');
var easyimport = require('postcss-easy-import');
var reporter = require('postcss-reporter');

// sass utils
var gulpSass = require('gulp-sass');
var sass = gulpSass(require('node-sass'));
var stylelint = require('stylelint');
var syntax_scss = require('postcss-scss');

var eslint = require('gulp-eslint');

var config = {
    isProduction: gulpUtil.env.production,
};

function serve(done) {
    livereload.listen();
    done();
}

const handleError = (done) => {
    return function (err) {
        if (err) {
            beeper();
        }
        return done(err);
    };
};

function hbs(done) {
    pump(
        [src(['*.hbs', '**/**/*.hbs', '!node_modules/**/*.hbs']), livereload()],
        handleError(done)
    );
}

function scss(done) {
    const tailwindcss = require('tailwindcss');
    const tailwindjs = require('./tailwind.config.js');
    var processors = [
        easyimport,
        colorFunction(),
        tailwindcss(tailwindjs),
        autoprefixer(),
        cssnano(),
    ];

    pump(
        [
            src(['assets/scss/main.scss', '!node_modules/**/*.scss', '!assets/built/**/*.scss'], {
                sourcemaps: !config.isProduction,
            }),
            sass().on('error', sass.logError),
            postcss(processors),
            dest('assets/built/', { sourcemaps: '.' }),
            livereload(),
        ],
        handleError(done)
    );
}

function scssLint(done) {
    var stylelintConfig2 = require('./.stylelintrc.json');

    var processors = [
        stylelint(stylelintConfig2),
        reporter({
            clearMessages: true,
            throwError: true,
        }),
    ];

    const scssLint = src([
        'assets/scss/**/*.scss',
        '!assets/scss/main.scss',
        '!assets/scss/a.tailwind.scss',
        '!node_modules/**/*.scss',
        '!assets/built/**/*.scss',
    ]).pipe(postcss(processors, { syntax: syntax_scss }));

    const jsLint = src(['assets/js/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());

    return merge(scssLint, jsLint);
}

function js(done) {
    pump(
        [
            src('assets/js/*.js', { sourcemaps: !config.isProduction }),
            uglify({
                mangle: config.isProduction,
                compress: config.isProduction,
                output: { beautify: !config.isProduction },
            }),
            dest('assets/built/', { sourcemaps: '.' }),
            livereload(),
        ],
        handleError(done)
    );
}

function vendor() {
    const highlightjsStyles = src('node_modules/@highlightjs/cdn-assets/styles/**').pipe(
        dest('assets/built/highlightjs/styles')
    );

    const highlightjs = src([
        'node_modules/@highlightjs/cdn-assets/highlight.min.js',
        'node_modules/@highlightjs/cdn-assets/languages/handlebars.min.js',
        'node_modules/@highlightjs/cdn-assets/languages/dockerfile.min.js',
    ])
        .pipe(concat('highlight.min.js'))
        .pipe(uglify())
        .pipe(dest('assets/built/highlightjs'));

    const fontawesome = src('node_modules/@fortawesome/fontawesome-free/webfonts/**').pipe(
        dest('assets/built/fontawesome/webfonts')
    );

    const jquery = src(['node_modules/jquery/dist/jquery.min.js']).pipe(dest('assets/built/js'));

    return merge(highlightjs, highlightjsStyles, fontawesome, jquery);
}

function clean(done) {
    const dir = 'assets/built';

    // delete directory recursively
    fs.rmdir(dir, { recursive: true }, (err) => {
        if (err) {
            handleError(done);
        }
    });

    done();
}

function zipper(done) {
    var targetDir = 'dist/';
    var themeName = require('./package.json').name;
    var filename = themeName + '.zip';

    pump(
        [
            src(['**', '!node_modules', '!node_modules/**', '!dist', '!dist/**']),
            zip(filename),
            dest(targetDir),
        ],
        handleError(done)
    );
}

// const cssWatcher = () => watch('assets/css/**', css);
const scssWatcher = () => watch('assets/scss/**', scss);
const hbsWatcher = () => watch(['*.hbs', '**/**/*.hbs', '!node_modules/**/*.hbs'], hbs);
const jsWatcher = () => watch(['assets/js/*.js'], js);
const watcher = parallel(scssWatcher, hbsWatcher, jsWatcher);
const build = series(clean, vendor, scss, js);
const dev = series(build, serve, watcher);
const lint = scssLint;

exports.build = build;
exports.lint = lint;
exports.zip = series(build, zipper);
exports.default = dev;
