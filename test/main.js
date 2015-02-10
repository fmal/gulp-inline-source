'use strict';

var gulp = require('gulp'),
    path = require('path'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    test = require('tape'),
    inlinesource = require('../');

function getFile (filePath, contents) {
    return new gutil.File({
        path: filePath,
        base: path.dirname(filePath),
        contents: contents || fs.readFileSync(filePath)
    });
}

function getFixture (filePath) {
    return getFile(path.join(__dirname, 'fixtures', filePath));
}

function getExpected (filePath) {
    return getFile(path.join(__dirname, 'expected', filePath));
}

function compare (stream, fixtureName, expectedName, t) {
    stream.on('data', function (newFile) {
        t.equal(String(getExpected(expectedName).contents), String(newFile.contents));
        t.end();
    });

    stream.write(getFixture(fixtureName));
}

test('inlines <script> tag', function (t) {
    compare(inlinesource(), 'script.html', 'inlined-script.html', t);
});

test('inlines <link> tag', function (t) {
    compare(inlinesource(), 'link.html', 'inlined-link.html', t);
});

test('works with type and media attributes', function (t) {
    compare(inlinesource(), 'with-attributes.html', 'inlined-with-attributes.html', t);
});

test('inlines assets without minification', function (t) {
    var stream = inlinesource({
        compress: false
    });

    compare(stream, 'nominify.html', 'inlined-nominify.html', t);
});

