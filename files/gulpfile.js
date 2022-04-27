"use strict";

const gulp = require("gulp"),
    del = require("del"),
    sass = require("gulp-sass")(require("sass")),
    eslint = require("gulp-eslint"),
    svgmin = require("gulp-svgmin"),
    postcss = require("gulp-postcss"),
    postinlinesvg = require("postcss-inline-svg"),
    jsonlint = require("gulp-jsonlint"),
    log = require("fancy-log"),

    paths_scss = [
        "assets/scss",
        "assets/scss/core",
        "node_modules/sisass/src/scss/"
    ],
    path_compile_scss = [
        "assets/scss/*.scss",
        "assets/scss/components/*.scss",
        "!assets/scss/svg.scss"
    ];

gulp.task("delete_svg", function () {
    return del("assets/img/svg/*.svg");
});

gulp.task("svgmin", function () {
    return gulp.src("assets/img/svg/orig/*")
        .pipe(svgmin(
            { removeStyleElement: true },
            { removeComments: true }
        ))
        .pipe(gulp.dest("assets/img/svg/"));
})

gulp.task("process_svg", function () {
    return gulp.src("assets/css/svg.css")
        .pipe(postcss([
            postinlinesvg({
                removeFill: true
            })
        ]))
        .pipe(gulp.dest("assets/css/"));
})

gulp.task("css_svg", function () {
    return gulp.src("assets/scss/svg.scss")
        .pipe(sass({
            outputStyle: "compressed",
            includePaths: paths_scss
        }).on("error", sass.logError))
        .pipe(gulp.dest("assets/css/"));
});

gulp.task("scss", function () {
    return gulp.src(path_compile_scss)
        .pipe(sass({
            outputStyle: "compressed",
            includePaths: paths_scss
        }).on("error", sass.logError))
        .pipe(gulp.dest("assets/css/"));
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

gulp.task("watch", function () {
    console.log("");
    console.log("---- INICIADO WATCH ----");

    gulp.watch("assets/js/*.js", gulp.series("lint"));
    gulp.watch("assets/json/*.json", gulp.series("jsonlint"));

    gulp.watch(path_compile_scss, gulp.series("scss"));
    gulp.watch("assets/scss/svg.scss", gulp.series("css_svg", "process_svg"));
    gulp.watch("assets/img/svg/orig/*.svg", gulp.series(
        "delete_svg",
        "svgmin",
        "css_svg",
        "process_svg"
    ));

    gulp.watch("assets/scss/core/*.scss", gulp.parallel(
        "scss",
        gulp.series("css_svg", "process_svg")
    ));
});

gulp.task("default", gulp.series("watch"));
