var _ = require('lodash'),
  through = require('through2'),
  gUtil = require('gulp-util'),
  pluginName = 'gulp-group-concat',
  glob = require("globule"),
  Concat = require('concat-with-sourcemaps'),
  vinylSourcemapsApply = require('vinyl-sourcemaps-apply');

module.exports = function (fileGlobs, opt) {
  opt = opt || {};
  if (!_.isPlainObject(fileGlobs)) {
    throw new gUtil.PluginError(pluginName, 'First argument must be an object of names and file globs')
  }

  var outFiles = {};
  var foundSourceMap = false;

  function concatBuffersOnly(files, filename) {
    //no source maps, do it fast
    for(var i = 0; i < files.length; i++) {
      files[i] = files[i].contents;
    }

    return new gUtil.File({
      cwd: "",
      base: "",
      path: filename,
      contents: Buffer.concat(files)
    });
  }

  function concatWithSourceMap(files, filename) {
    var outFile, i, sourceStream, inFiles = {};
    for(i = 0; i < files.length; i++) {
      if (!inFiles[files[i].path]) {
        inFiles[files[i].path] = files[i].contents.toString();
      }
    }
    sourceStream = new Concat(filename, opt.newLine || '\n');
    for(i = 0; i < files.length; i++) {
      sourceStream.add(files[i].relative, inFiles[files[i].path], files[i].sourceMap);
    }
    outFile = new gUtil.File({
      cwd: "",
      base: "",
      path: filename,
      contents: new Buffer(sourceStream.content)
    });
    vinylSourcemapsApply(outFile, sourceStream.sourceMap);
    return outFile;
  }

  function addContent(filename, file) {
    if (!outFiles[filename]) {
      outFiles[filename] = [];
    }
    if (file.sourceMap) {
      foundSourceMap = true;
    }
    outFiles[filename].push(file);
  }

  return through.obj(function (file, encoding, cb) {

    _.each(fileGlobs, function (fileglob, filename) {
      var path = file.cwd ? file.path.substring(file.cwd.length + 1) : file.path;
      var matches = glob.match(fileglob, path);
      if (matches.length) {
        addContent(filename, file)
      }
    });

    //save the files until they're done streaming/buffering
    cb()
  }, function (cb){
    var self = this;

    //once they're done giving us files, we give them the concatenated results
    _.each(outFiles, function (files, filename) {
      self.push(foundSourceMap ? concatWithSourceMap(files, filename) : concatBuffersOnly(files, filename));
    });

    cb()
  });
};