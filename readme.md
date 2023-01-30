Gulp Group Concat
=================

> **⚠ Warning**
> This library is deprecated. The underlying libraries that this package relies on are either unmaintained or have security warnings. I'm deprecating this project until someone rewrites it with modern tooling.

Concatenates and filters groups of files into a smaller number of files.

##Concatenate files that match minimatch-styled file globs

Groups all files into either `final.inline.js` and `final.test.js`.

```JavaScript
var gulp = require('gulp'),
  groupConcat = require('gulp-group-concat');

gulp.src('**/*.js')
  .pipe(groupConcat({
    'final.inline.js': ['**/*.js', '!**/*.test.js'],
    'final.test.js': '**/*.test.js'
  }))
  .pipe(gulp.dest('dest'));
```

##Duplicate files that match more than one file glob

Put only components into `components.js` but include everything in `all.js`.

```JavaScript
var gulp = require('gulp'),
  groupConcat = require('gulp-group-concat');

gulp.src('**/*.js')
  .pipe(groupConcat({
    'components.js': '**/components/*.js',
    'all.js': '**/*.js'
  }))
  .pipe(gulp.dest('dest'));
```

##Filter files that do not match any file glob

Include all files that are not tests into `no-tests.js`.

```JavaScript
var gulp = require('gulp'),
  groupConcat = require('gulp-group-concat');

gulp.src('**/*.js')
  .pipe(groupConcat({
    'no-tests.js': '!**/*.test.js'
  }))
  .pipe(gulp.dest('dest'));
```

##Supports source-maps

Source-maps are duplicated, filtered, and concatenated as expects.

```JavaScript
var gulp = require('gulp'),
  groupConcat = require('gulp-group-concat'),
  sourcemaps = require('gulp-sourcemaps'),
  please = require('gulp-pleeease');

gulp.src('./test/fixtures/*.css')
  .pipe(sourcemaps.init())
  .pipe(please()) //or anything else that supports gulp-sourcemaps
  .pipe(groupConcat({
    'final.inline.css': '**/*.inline.css',
    'final.css': '**/*.css'
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dest'));
```

##Install

```Sh
npm install gulp-group-concat
```

##Running Tests

To run the basic tests, just run `mocha` normally.

This assumes you've already installed the local npm packages with `npm install`.
