const { series, watch, src, dest, parallel } = require('gulp');
const pump = require('pump');

// gulp plugins and utils
const livereload = require('gulp-livereload');
const postcss = require('gulp-postcss');
const zip = require('gulp-zip');
const uglify = require('gulp-uglify');
const gulpUtil = require('gulp-util');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

// general utils
const beeper = require('beeper');
const merge = require('merge-stream');
const fs = require('fs');

// postcss plugins
const autoprefixer = require('autoprefixer');
const colorFunction = require('postcss-color-mod-function');
const cssnano = require('cssnano');
const easyimport = require('postcss-easy-import');
const reporter = require('postcss-reporter');

// sass utils
const gulpSass = require('gulp-sass');
const sass = gulpSass(require('node-sass'));
const stylelint = require('stylelint');
const syntax_scss = require('postcss-scss');

// js utils

const config = {
    isProduction: gulpUtil.env.production,
    files: {
        js: {
            in: 'assets/js/main.js',
            out: 'assets/built',
            vendor: 'assets/js/vendor.js',
        },
        css: {
            in: ['assets/scss/main.scss', '!node_modules/**/*.scss', '!assets/built/**/*.scss'],
            out: 'assets/built/',
        },
    },
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
            src(config.files.css.in, {
                sourcemaps: !config.isProduction,
            }),
            sass().on('error', sass.logError),
            postcss(processors),
            dest(config.files.css.out, { sourcemaps: '.' }),
            livereload(),
        ],
        handleError(done)
    );
}

function jsTask() {
    return browserify(config.files.js.in, { debug: !config.isProduction })
        .transform('babelify', {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
        })
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(!config.isProduction ? sourcemaps.init({ loadMaps: true }) : gulpUtil.noop())
        .pipe(
            uglify({
                mangle: config.isProduction,
                compress: config.isProduction,
                output: { beautify: !config.isProduction },
            })
        )
        .pipe(sourcemaps.write('.'))
        .pipe(dest(config.files.js.out));
}

function vendorJsTask() {
    return browserify(config.files.js.vendor, { debug: !config.isProduction })
        .transform('babelify', {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime'],
        })
        .bundle()
        .pipe(source('vendor.js'))
        .pipe(buffer())
        .pipe(!config.isProduction ? sourcemaps.init({ loadMaps: true }) : gulpUtil.noop())
        .pipe(
            uglify({
                mangle: config.isProduction,
                compress: {
                    keep_fargs: 'strict',
                },
                output: { beautify: !config.isProduction, comments: /(?:^!|@(?:license|preserve|cc_on))/ },
            })
        )
        .pipe(sourcemaps.write('.'))
        .pipe(dest(config.files.js.out));
}

function vendor() {
    const highlightjsStyles = src('node_modules/highlight.js/styles/**').pipe(
        dest('assets/built/highlightjs/styles')
    );

    const fontawesome = src('node_modules/@fortawesome/fontawesome-free/webfonts/**').pipe(
        dest('assets/built/fontawesome/webfonts')
    );

    return merge(highlightjsStyles, fontawesome);
}

function lint() {
    var stylelintConfig = require('./.stylelintrc.json');

    var processors = [
        stylelint(stylelintConfig),
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

function clean(done) {
    const dir = 'assets/built';

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

const scssWatcher = () => watch('assets/scss/**', scss);
const hbsWatcher = () => watch(['*.hbs', '**/**/*.hbs', '!node_modules/**/*.hbs'], hbs);
const jsWatcher = () => watch(['assets/js/*.js'], jsTask);
const watcher = parallel(scssWatcher, hbsWatcher, jsWatcher);
const build = series(clean, vendor, scss, jsTask, vendorJsTask);
const dev = series(build, serve, watcher);

exports.build = build;
exports.lint = lint;
exports.zip = series(build, zipper);
exports.default = dev;
exports.js = jsTask;
