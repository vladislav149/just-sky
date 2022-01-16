const { src, dest, watch, parallel, series } = require('gulp');

const scss         = require('gulp-sass')(require('sass'));
const concat       = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify       = require('gulp-uglify');
const imagemin     = require('gulp-imagemin');
const del          = require('del');
const fileInclude  = require('gulp-file-include');
const browserSync  = require('browser-sync').create();
const svgSprite    = require('gulp-svg-sprite');

function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'app/'
    },
    notify: false
  })
}

function fileincludes() {
  return src ('app/html/pages/*.html')
  .pipe(fileInclude())
  .pipe(dest('app'))
  .pipe(browserSync.stream())
}

function svgsprite() {
  return src('app/images/icon/**/*.svg')
  .pipe(svgSprite({
    mode: {
      stack: {
        sprite: '../sprite.svg'
      }
    }
  }))
  .pipe(dest('app/images/svg_sprite/'))
}

function styles() {
  return src('app/scss/style.scss')
    .pipe(scss({outputStyle: 'compressed'}).on('error', scss.logError))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 10 version'],
      grid: true
    }))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    //'node_modules/slick-carousel/slick/slick.js',
    //'node_modules/mixitup/dist/mixitup.js',
    //'node_modules/rateyo/min/jquery.rateyo.min.js',
    //'node_modules/simplebar/dist/simplebar.min.js',
    'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js',
    'app/js/main.js'
  ])
  .pipe(concat('main.min.js'))
  .pipe(uglify())
  .pipe(dest('app/js'))
  .pipe(browserSync.stream())
}

function images() {
  return src('app/images/**/*.*')
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
	  imagemin.mozjpeg({quality: 75, progressive: true}),
	  imagemin.optipng({optimizationLevel: 5}),
	  imagemin.svgo({
		  plugins: [
			  {removeViewBox: true},
			  {cleanupIDs: false}
		]
	})
  ]))
  .pipe(dest('dist/images'))
}


function build () {
  return src([
    'app/*.html',
    'app/css/style.min.css',
    'app/js/main.min.js'
  ], {base: 'app'})
  .pipe(dest('dist'))
}

function cleanDist() {
  return del('dist')
}

function watching() {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch('app/html/**/*.html', fileincludes);
  watch(['app/images/icon/**/*.svg', '!app/images/svg_sprite/sprite.svg'], svgsprite);
}


exports.styles        = styles;
exports.scripts       = scripts;
exports.browsersync   = browsersync;
exports.fileincludes  = fileincludes;
exports.watching      = watching;
exports.cleanDist     = cleanDist;
exports.images        = images;
exports.svgsprite     = svgsprite;
exports.build         = series(cleanDist, images, build);

exports.default = parallel(styles, fileincludes, scripts, browsersync, watching, svgsprite);