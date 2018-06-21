var inlineSource = require('inline-source'),
    PluginError = require('plugin-error'),
    path = require('path'),
    through = require('through2');

const PLUGIN_NAME = 'gulp-inline-source';

function gulpInlineSource (options) {
    'use strict';

    var stream = through.obj(function (file, enc, cb) {
        var self = this;

        if (file.isNull() || file.isDirectory()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        var fileOptions = {
            rootpath: path.dirname(file.path),
            htmlpath: file.path
        };

        if (options) {
            for (var i in options) {
                fileOptions[i] = options[i];
            }
        }

        inlineSource(file.contents.toString(), fileOptions, function (err, html) {
            if (err) {
                self.emit('error', new PluginError(PLUGIN_NAME, err));
            } else {
                file.contents = new Buffer(html || '');
                self.push(file);
            }

            cb();
        });
    });

    return stream;
}

module.exports = gulpInlineSource;
