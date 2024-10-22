import { src, dest, series, watch } from "gulp";
import { deleteAsync } from "del";
import concat from "gulp-concat";
import browserSync from "browser-sync";
import htmlmin from "gulp-htmlmin";
import cleanCSS from "gulp-clean-css";
import autoprefixer from "gulp-autoprefixer";
import image from "gulp-image";
import svgSprite from "gulp-svg-sprite";
import terser from "gulp-terser";
import babel from "gulp-babel";
import * as dartSass from "sass";
import gulpSass from "gulp-sass";

const SRC_DIR = `./src`;
const sass = gulpSass(dartSass);
const isDevMode =
  process.argv[process.argv.length - 1] === `dev` ? true : false;
const destDir = isDevMode ? `./build_dev` : `./build`;

const optimizHTML = () => {
  return src(`${SRC_DIR}/**/*.html`)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest(destDir))
    .pipe(browserSync.stream());
};

const sassToCSS = () => {
  return src(`${SRC_DIR}/styles/sass/style.scss`)
    .pipe(sass.sync().on("error", sass.logError))
    .pipe(dest(`${SRC_DIR}/styles/css/`))
    .pipe(browserSync.stream());
};

const optimizCSS = () => {
  return src(
    [`${SRC_DIR}/styles/css/normalize.css`, `${SRC_DIR}/styles/css/style.css`],
    { sourcemaps: isDevMode }
  )
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(concat(`main.css`))
    .pipe(dest(`${destDir}/css/`, { sourcemaps: isDevMode }))
    .pipe(browserSync.stream());
};

const copyIMG = () => {
  return src(
    [
      `${SRC_DIR}/img/**/*.{jpg,jpeg,png,svg,gif,ico}`,
      `!${SRC_DIR}/img/svg/*.svg`,
    ],
    { encoding: false }
  ).pipe(dest(`${destDir}/img/`));
};

const optimizIMG = () => {
  return src(
    [
      `${SRC_DIR}/img/**/*.{jpg,jpeg,png,svg,gif,ico}`,
      `!${SRC_DIR}/img/svg/*.svg`,
    ],
    { encoding: false }
  )
    .pipe(image())
    .pipe(dest(`${destDir}/img/`));
};

const makeSprite = () => {
  const config = {
    mode: {
      symbol: { sprite: `../sprite.symbol.svg` },
      view: { bust: false, sprite: `../sprite.view.svg` },
      stack: { sprite: `../sprite.svg` },
    },
  };

  return src(`${SRC_DIR}/img/svg/*.svg`)
    .pipe(svgSprite(config))
    .pipe(dest(`${destDir}/img`));
};

const optimizJS = () => {
  return src(`${SRC_DIR}/js/**/*.js`, {
    sourcemaps: isDevMode,
  })
    .pipe(babel({ presets: [`@babel/env`] }))
    .pipe(concat(`main.js`))
    .pipe(terser({ toplevel: true }))
    .pipe(dest(`${destDir}/js`), { sourcemaps: isDevMode })
    .pipe(browserSync.stream());
};

const copyLibs = () => {
  return src(`${SRC_DIR}/libs/**`).pipe(dest(`${destDir}/libs`));
};

const copyPhpmailer = () => {
  return src(`${SRC_DIR}/phpmailer/**`).pipe(dest(`${destDir}/phpmailer`));
};

const clean = () => deleteAsync(`${destDir}/*`);

const copyAssets = () => {
  return src(`${SRC_DIR}/fonts/**`, { encoding: false }).pipe(
    dest(`${destDir}/fonts/`)
  );
};

const toWatch = () => {
  browserSync.init({ server: { baseDir: destDir } });

  watch(`${SRC_DIR}/fonts/**`, copyAssets);
  watch(`${SRC_DIR}/libs/**`, copyLibs);
  watch(`${SRC_DIR}/img/**/*.{jpg,jpeg,png,svg,gif,ico}`, optimizIMG);
  watch(`${SRC_DIR}/img/svg/*.svg`, makeSprite);
  watch(`${SRC_DIR}/styles/sass/**/*.scss`, sassToCSS);
  watch(`${SRC_DIR}/styles/css/**/*.css`, optimizCSS);
  watch(`${SRC_DIR}/js/**/*.js`, optimizJS);
  watch(`${SRC_DIR}/*.html`, optimizHTML);
};

const dev = series(
  clean,
  copyAssets,
  copyLibs,
  copyPhpmailer,
  copyIMG,
  makeSprite,
  sassToCSS,
  optimizCSS,
  optimizJS,
  optimizHTML,
  toWatch
);

const build = series(
  clean,
  copyAssets,
  copyLibs,
  copyPhpmailer,
  optimizIMG,
  makeSprite,
  sassToCSS,
  optimizCSS,
  optimizJS,
  optimizHTML
);

export { dev, build };
