//@ts-check

var gulp = require('gulp');
var ts = require('gulp-typescript');
const {default: keysTransform} = require('../../dist');

var tsProject = ts.createProject('./tsconfig.json', {
   // noImplicitAny: true,
   // outFile: 'output.js',
   getCustomTransformers: (program) => ({
      before: program ? [
         keysTransform(program),
      ] : []
   })
});

gulp.task('default', function () {
   return gulp.src(['src/**/*.ts', '../../sources/index.d.ts'])
      .pipe(tsProject())
      .on('error', () => {
         console.log('error')
      })
      .pipe(gulp.dest('built/local'));
});
