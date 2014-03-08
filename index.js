var fs = require('fs'),
    inlineSource = require('inline-source'),
    gutil = require('gulp-util'),
    through = require('through2');

const PLUGIN_NAME = 'gulp-inline-source';

function gulpInlineSource(htmlpath) {
    'use strict';

    if (htmlpath && !fs.existsSync(htmlpath)) {
        throw new gutil.PluginError(PLUGIN_NAME, 'Path ' + htmlpath + ' cannot be found.');
    }

    var stream = through.obj(function(file, enc, cb) {

        if (file.isNull() || file.isDirectory()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        try {
            var filePath = htmlpath || file.cwd;
            file.contents = new Buffer(inlineSource(filePath, file.contents.toString()));
        } catch (err) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
        }

        this.push(file);
        return cb();
    });

    return stream;
}

module.exports = gulpInlineSource;
