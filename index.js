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

  var sourceStreams = {};

  function addContent(filename, file) {
    var contents = file.contents.toString();
    if (!sourceStreams[filename]) {
      sourceStreams[filename] = new Concat(filename, opt.newLine || '\n');
      sourceStreams[filename].add(file.relative, contents, file.sourceMap);
    } else {
      sourceStreams[filename].add(file.relative, contents, file.sourceMap);
    }
  }

  return through.obj(function (file, encoding, cb) {

    _.each(fileGlobs, function (fileglob, filename) {
      if (glob.match(fileglob, file.path)) {
        addContent(filename, file)
      }
    });

    //save the files until they're done streaming/buffering
    cb()
  }, function (cb){
    var self = this;

    //once they're done giving us files, we give them the concatenated results
    _.each(sourceStreams, function (sourceStream, filename) {
      var file =new gUtil.File({
        cwd: "",
        base: "",
        path: filename,
        contents: new Buffer(sourceStream.content)});


        vinylSourcemapsApply(file, sourceStream.sourceMap);
      self.push(file);
    });

    cb()
  });
};