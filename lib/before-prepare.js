var match = require('minimatch');
var converter = require('./converter');

module.exports = function (logger, platformsData, projectData, hookArgs) {
	// Do not run converter during LiveSync if there are no SCSS files being processed
	var runProcessor = false;
	if (hookArgs.filesToSync !== undefined) {
		hookArgs.filesToSync.forEach(function (file) {
			if (match(file, '**/*.@(jpg|png|gif)')) {
				runProcessor = true;
			}
		});
	} else {
		// Not a LiveSync operation; always run converter
		runProcessor = true;
	}

	if (runProcessor) {
		console.log("Generating exports for assets...");
		return converter.convert(logger, projectData.projectDir);
	}
}
