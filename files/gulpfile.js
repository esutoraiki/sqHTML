"use strict";

const
    gulp = require("gulp"),
    del = require("del"),
    sass = require("gulp-sass")(require("sass")),
    eslint = require("gulp-eslint"),
    svgmin = require("gulp-svgmin"),
    postcss = require("gulp-postcss"),
    postinlinesvg = require("postcss-inline-svg"),
    jsonlint = require("gulp-jsonlint"),
    merge = require("merge-stream"),
    browserSync = require("browser-sync").create(),
    arg = require("./utils/arg.js").arg,

    port =  Number(arg.port) || Number(arg.p) || 3000,
    port_serve =  Number(arg.portServe) || 8125,
    sync = arg.sync || true,

    reload = browserSync.reload,

    // NOTE: foler core and sisass last element of array
    paths_scss = [
        "assets/scss/",
        "assets/scss/core/",
        "node_modules/sisass/src/scss/"
    ],
    paths_dest_css = [
        "assets/css/",
        "assets/css/pages/",
        "assets/css/components/"
    ],
    paths_compile_scss = [
        "assets/scss/*.scss",
        "assets/scss/pages/*.scss",
        "assets/scss/components/*.scss"
    ],

    path_svg = "assets/scss/svg/*.scss",
    path_dest_svg = "assets/css/svg/",

    path_img_svg = "assets/img/svg/*.svg",
    path_orig_img_svg = "assets/img/svg/orig/*.svg",
    path_dest_img_svg = "assets/img/svg/"
;

gulp.task("delete_svg", function () {
    console.log("");
    console.log("---- SVG ----");

    return del(path_img_svg);
});

gulp.task("svgmin", function () {
    return gulp.src(path_orig_img_svg)
        .pipe(svgmin(
            { removeStyleElement: true },
            { removeComments: true }
        ))
        .pipe(gulp.dest(path_dest_img_svg));
})

gulp.task("process_svg", function () {
    return gulp.src(path_dest_svg + "*.css")
        .pipe(postcss([
            postinlinesvg({
                removeFill: true
            })
        ]))
        .pipe(gulp.dest(path_dest_svg));
})

gulp.task("css_svg", function () {
    console.log("");
    console.log("---- Styles SVG ----");

    return gulp.src(path_svg)
        .pipe(sass({
            outputStyle: "compressed",
            includePaths: paths_scss
        }).on("error", sass.logError))
        .pipe(gulp.dest(path_dest_svg));
});

gulp.task("scss", function () {
    console.log("");
    console.log("---- Styles ----");

    let task_array = [];

    for (let i = 0; i < paths_compile_scss.length - 1; i++) {
        task_array[i] = gulp.src(paths_compile_scss[i])
            .pipe(sass({
                outputStyle: "compressed",
                includePaths: paths_scss
            }).on("error", sass.logError))
            .pipe(gulp.dest(paths_dest_css[i]));
    }

    console.log("");
    return merge(...task_array);
});

gulp.task("lint", function() {
    console.log("");
    console.log("---- ES-LINT ----");

    return gulp.src("assets/js/*.js")
        .pipe(eslint({}))
        .pipe(eslint.format())
        .pipe(eslint.results(results => {
            // Called once for all ESLint results.
            console.log(`Total Results: ${results.length}`);
            console.log(`Total Warnings: ${results.warningCount}`);
            console.log(`Total Errors: ${results.errorCount}`);

            console.log("");
        }));
});

gulp.task("jsonlint", function () {
    console.log("");
    console.log("---- JSON-LINT ----");

    let
        myCustomReporter = function (file) {
            log("File " + file.path + " is not valid JSON.");
        }
    ;

    return gulp.src("assets/json/*.json")
        .pipe(jsonlint())
        .pipe(jsonlint.reporter(myCustomReporter));
});

gulp.task("browserSync", function() {
    console.log("");
    console.log("---- INICIADO BROWSERSYNC ----");

    browserSync.init({
        proxy: "http://localhost:" + port_serve,
        open: false,
        notify: false,
        port: port,
        codeSync: sync
    });
});

gulp.task("watch", function () {
    console.log("");
    console.log("---- INICIADO WATCH ----");

    gulp.watch("assets/js/*.js", gulp.series("lint")).on("change", reload);
    gulp.watch("assets/json/*.json", gulp.series("jsonlint")).on("change", reload);

    gulp.watch(paths_compile_scss, gulp.series("scss")).on("change", reload);
    gulp.watch(path_svg, gulp.series("css_svg", "process_svg")).on("change", reload);
    gulp.watch(path_orig_img_svg, gulp.series(
        "delete_svg",
        "svgmin",
        "css_svg",
        "process_svg"
    )).on("change", reload);

    gulp.watch("assets/scss/core/*.scss", gulp.parallel(
        "scss",
        gulp.series("css_svg", "process_svg")
    )).on("change", reload);
});

gulp.task("default", gulp.parallel("watch", "browserSync"));
