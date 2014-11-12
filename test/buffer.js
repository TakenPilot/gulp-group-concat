var gulp = require('gulp'),
  expect = require('chai').expect,
  gUtil = require('gulp-util'),
  groupConcat = require('../.'),
  buffer = require('vinyl-buffer'),
  sourcemaps = require('gulp-sourcemaps'),
  please = require('gulp-pleeease');

function tests(withBuffer) {
  it('no matchs returns no files', function (done) {
    gulp.src('./test/fixtures/*')
      .pipe(withBuffer ? buffer() : gUtil.noop())
      .pipe(groupConcat({}))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files).to.have.length(0);
        done();
      }))
  });

  it('match returns file', function (done) {
    gulp.src('./test/fixtures/*')
      .pipe(withBuffer ? buffer() : gUtil.noop())
      .pipe(groupConcat({'myFile': '**/*'}))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files).to.have.length(1);
        done();
      }))
  });

  it('multi-match with two groups returns two files', function (done) {
    gulp.src('./test/fixtures/*')
      .pipe(withBuffer ? buffer() : gUtil.noop())
      .pipe(groupConcat({
        'myFile1': '**/*1*',
        'myFile2': '**/*2*'
      }))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files).to.have.length(2);
        done();
      }))
  });

  it('multi-match with two groups returns two files with source-maps', function (done) {
    gulp.src('./test/fixtures/*.css')
      .pipe(withBuffer ? buffer() : gUtil.noop())
      .pipe(sourcemaps.init())
      .pipe(please())
      .pipe(groupConcat({
        'myFile1': '**/*1*',
        'myFile2': '**/*2*'
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files).to.have.length(4);
        done();
      }))
  });

  it('can ask for negation', function (done) {
    gulp.src('./test/fixtures/*.css')
      .pipe(withBuffer ? buffer() : gUtil.noop())
      .pipe(sourcemaps.init())
      .pipe(please())
      .pipe(groupConcat({
        'myFile1': '!**/*1*'
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files).to.have.length(2);
        done();
      }))
  });

  it('can ask for negation within glob', function (done) {
    gulp.src('./test/fixtures/*.css')
      .pipe(withBuffer ? buffer() : gUtil.noop())
      .pipe(sourcemaps.init())
      .pipe(please())
      .pipe(groupConcat({
        'myFile1': ['**/*', '!**/*1*']
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files).to.have.length(2);
        done();
      }))
  });
}

describe('with buffers', function () {
  tests(true);
});

describe('without buffers', function () {
  tests(false);
});