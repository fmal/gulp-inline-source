var inlineSource = require('inline-source'),
    gutil = require('gulp-util'),
    through = require('through2');

const PLUGIN_NAME = 'gulp-inline-source';

function gulpInlineSource (options) {
    'use strict';

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
            options = options || {};

            var filePath = file.path;

            options.rootpath = options.rootpath || filePath;
            
            var contents = inlineSource(filePath, file.contents.toString(), options);
            file.contents = new Buffer(contents || '');
        } catch (err) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
        }

        this.push(file);
        return cb();
    });

    return stream;
}

module.exports = gulpInlineSource;
