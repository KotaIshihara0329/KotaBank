const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const csscomb = require("gulp-csscomb");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const pug = require("gulp-pug");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const del = require("del");
const fs = require("fs");
const runSequence = require("run-sequence");

// config.json
const json = JSON.parse(fs.readFileSync("./config.json"));

// pug
gulp.task("pug", () => {
  return gulp
    .src([
      json.paths.src + "pug/**/*.pug",
      "!" + json.paths.src + "pug/**/_*.pug",
    ])
    .pipe(
      plumber({
        errorHandler: notify.onError("<%= error.message %>"),
      })
    )
    .pipe(
      pug({
        pretty: "\t",
        doctype: "html",
      })
    )
    .pipe(gulp.dest(json.paths.dest));
});

// sass
gulp.task("sass", () => {
  gulp
    .src([
      json.paths.src + "scss/**/*.scss",
      "!" + json.paths.src + "scss/**/_*.scss",
    ])
    .pipe(
      plumber({
        errorHandler: notify.onError("<%= error.message %>"),
      })
    )
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(
      sourcemaps.write({
        includeContent: false,
      })
    )
    .pipe(
      sourcemaps.init({
        loadMaps: true,
      })
    )
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions", "iOS >= 8.1", "Android >= 4.4"],
        cascade: false,
      })
    )
    .pipe(csscomb())
    .pipe(gulp.dest(json.paths.dest + json.paths.assets + "css/"))
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(cleanCSS())
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest(json.paths.dest + json.paths.assets + "css/"));
});

// js
gulp.task("js", () => {
  gulp
    .src([json.paths.src + "js/**/*.js"])
    .pipe(
      plumber({
        errorHandler: notify.onError("<%= error.message %>"),
      })
    )
    .pipe(gulp.dest(json.paths.dest + json.paths.assets + "js/"));
});

// img tasks
gulp.task("initialize", () => {
  return del([json.paths.dest + json.paths.assets + "img/"]);
});
gulp.task("img", () => {
  return gulp
    .src([json.paths.src + "img/**/*.{png,jpg,gif,svg}"])
    .pipe(gulp.dest(json.paths.dest + json.paths.assets + "img/"));
});
gulp.task("runSequence", (callback) => {
  return runSequence("initialize", "img", callback);
});

// watch
gulp.task("watch", () => {
  gulp.watch(json.paths.src + "pug/**/*.pug", ["pug"]);
  gulp.watch(json.paths.src + "scss/**/*.scss", ["sass"]);
  gulp.watch(json.paths.src + "js/**/*.js", ["js"]);
  gulp.watch(json.paths.src + "img/**/*.{png,jpg,gif,svg}", ["runSequence"]);
});
