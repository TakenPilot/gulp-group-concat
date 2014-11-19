var _ = require('lodash'),
  gulp = require('gulp'),
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
        expect(_.some(files, function (file) {
          //one or more files have a reference to this filename (thus having a sourcemap)
          return file.contents.toString().indexOf('genericCss1.css') > -1;
        })).to.equal(true);
        done();
      }))
  });

  it('can ask for negation', function (done) {
    gulp.src('./test/fixtures/*')
      .pipe(withBuffer ? buffer() : gUtil.noop())
      .pipe(groupConcat({
        'myFile1': ['**/*', '!**/*.css']
      }))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files).to.have.length(1);
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

  it('can duplicate', function (done) {
    gulp.src('./test/fixtures/*')
      .pipe(withBuffer ? buffer() : gUtil.noop())
      .pipe(groupConcat({
        'myFile1': '**/*',
        'myFile2': '**/*'
      }))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files).to.have.length(2);
        files.forEach(function (file) {
          //all files contain these
          expect(file.contents.toString()).to.contain('Some generic text in the first text file');
          expect(file.contents.toString()).to.contain('Some generic text in the second text file');
        });
        done();
      }))
  });

  it('matches on any positive', function (done) {
    gulp.src('./test/fixtures/*')
      .pipe(withBuffer ? buffer() : gUtil.noop())
      .pipe(groupConcat({
        'myFile': ['**/thing', '**/*']
      }))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files).to.have.length(1);
        files.forEach(function (file) {
          //all files contain these
          expect(file.contents.toString()).to.contain('Some generic text in the first text file');
          expect(file.contents.toString()).to.contain('Some generic text in the second text file');
        });
        done();
      }))
  });

  it('does not match everything always', function (done) {
    gulp.src('./test/fixtures/*')
      .pipe(withBuffer ? buffer() : gUtil.noop())
      .pipe(groupConcat({
        'myFile': ['**/*.css']
      }))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files).to.have.length(1);
        files.forEach(function (file) {
          //all files contain these
          expect(file.contents.toString()).to.not.contain('Some generic text in the first text file');
          expect(file.contents.toString()).to.not.contain('Some generic text in the second text file');
        });
        done();
      }))
  });

  it('matches from base', function (done) {
    gulp.src('test/fixtures/*')
      .pipe(withBuffer ? buffer() : gUtil.noop())
      .pipe(groupConcat({
        'myFile': ['test/fixtures/*.css']
      }))
      .pipe(gUtil.buffer(function (err, files) {
        expect(files).to.have.length(1);
        files.forEach(function (file) {
          //all files contain these
          expect(file.contents.toString()).to.not.contain('Some generic text in the first text file');
          expect(file.contents.toString()).to.not.contain('Some generic text in the second text file');
        });
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

describe('config failure', function () {
  it('throws on being given array', function (done) {
    expect(function () {
      gulp.src('./test/fixtures/*')
        .pipe(groupConcat(['**/*']))
        .pipe(gUtil.buffer(function (err, files) {
          done(err || files);
        }))
    }).to.throw();
    done();
  });

});