/*
 * section-highlight
 * https://github.com/iclanzan/section-highlight
 *
 * Copyright (c) 2013 Sorin Iclanzan
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

module.exports = function(grunt) {
  var hljs = require('highlight.js');
  var supportedLanguages = Object.keys(hljs.LANGUAGES);

  function handleHighlighting() {
    var $el = this;
    var code = $el.text();
    var lang = ($el.attr('class') || '').replace('lang-', '');

    if (lang && ~supportedLanguages.indexOf(lang)) {
      $el.html(hljs.highlight(lang, code).value);
    }

    else if(lang != 'text' && lang != 'plain') {
      $el.html(hljs.highlightAuto(code).value);
    }
  }

  // Add highlighting to code blocks after generating html pages.
  // We are not doing it when parsing markdown because cheerio is
  // stripping whitespaces.
  grunt.event.on('section.render.html', function ($, page) {
    var codeBlocks = $('pre > code');
    if (codeBlocks.length) {
      codeBlocks.each(handleHighlighting);

      page.root.files.push({
        src: path.join(__dirname, 'highlight.css'),
        dest: path.join(page.options.dest, 'highlight.css')
      });

      $('head').append('<link href="/highlight.css" rel="stylesheet" media="all" />');
    }
  });
};
