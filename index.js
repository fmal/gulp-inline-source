'use strict';

const { inlineSource } = require('inline-source');
const PluginError = require('plugin-error');
const path = require('path');
const through = require('through2');

const PLUGIN_NAME = 'gulp-inline-source';

function gulpInlineSource (options) {
    return through.obj(function (file, enc, cb) {
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

        inlineSource(file.contents.toString(), fileOptions)
            .then(html => {
                file.contents = Buffer.from(html || '');
                self.push(file);
                cb();
            })
            .catch(err => {
                self.emit('error', new PluginError(PLUGIN_NAME, err));
            });
    });
}

module.exports = gulpInlineSource;
