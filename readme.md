Gulp Group Concat
-----------------

Reads data, partials and helpers from asynchronous sources like a databases, file systems, or promises.

[![Build Status](https://travis-ci.org/TakenPilot/gulp-group-concat.svg?branch=master)](https://travis-ci.org/TakenPilot/gulp-group-concat)

[![Code Climate](https://codeclimate.com/github/TakenPilot/gulp-group-concat/badges/gpa.svg)](https://codeclimate.com/github/TakenPilot/gulp-group-concat)

[![Coverage Status](https://img.shields.io/coveralls/TakenPilot/gulp-group-concat.svg)](https://coveralls.io/r/TakenPilot/gulp-group-concat?branch=master)

[![Dependencies](https://david-dm.org/TakenPilot/gulp-group-concat.svg?style=flat)](https://david-dm.org/TakenPilot/gulp-group-concat.svg?style=flat)

[![NPM version](https://badge.fury.io/js/gulp-group-concat.svg)](http://badge.fury.io/js/gulp-group-concat)

##Example with JavaScript:

```JavaScript
var gulp = require('gulp'),
  groupConcat = require('group-concat');

gulp.src('**/*.js')
  .pipe(groupConcat({
    'final.inline.js': '**/*.inline.js',
    'final.test.js': '**/*.test.js'
  }))
  .pipe(gulp.dest('dest'));
```

##Example with source-maps and CSS:

```JavaScript
var gulp = require('gulp'),
  groupConcat = require('group-concat'),
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