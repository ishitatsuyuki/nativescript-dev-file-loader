exports.convert = convert;

var fs = require('fs');
var path = require('path');
var glob = require('glob');

function convert(logger, projectDir, options) {
  return new Promise(function (resolve, reject) {
    options = options || {};

    var blobFilesPattern = 'app/**/*.@(jpg|png|gif)';

    var blobFiles = glob.sync(blobFilesPattern, { cwd: projectDir, follow: true }).filter(function (filePath) {
      var parts = filePath.split('/');
      return parts.indexOf("App_Resources") === -1;
    });

    if (blobFiles.length === 0) {
      // No asset files in project; skip parsing
      resolve();
    } else {
      var i = 0;
      var loopAssetsAsync = function (assets) {
        writeExports(projectDir, assets[i], function (e) {
          if (e !== undefined) {
            reject(Error(assets[i] + ' processing failed. Error: ' + e));
          }

          i++; //Increment loop counter

          if (i < assets.length) {
            loopAssetsAsync(assets);
          } else {
            // All files have been processed; Resolve promise
            resolve();
          }
        });
      }

      loopAssetsAsync(blobFiles);
    }
  });
}

function writeExports(baseDir, filePath, callback) {
  var jsFilePath = path.join(baseDir, filePath + '.js');

  let output = 'module.exports="' + filePath.replace(/^app/, '~') + '"';

  fs.writeFile(jsFilePath, output, { flag: 'wx' }, function () {
    // File done writing
    callback();
  });
}
