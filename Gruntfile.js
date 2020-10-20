var FONT_VERSION = '1.0.0';

var CODEPOINTS = {
};

var path = require('path');

var PATH_BUILD_ICONS = './build/icons',
    PATH_DIST_FONTS = './dist/fonts',
    PATH_DIST_STYLES = './dist/styles',
    PATH_DIST_SVG    = './dist/svg',
    PATH_DIST_HTML = './dist/html';

module.exports = function (grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-svg-sprite');
  grunt.loadNpmTasks('grunt-webfont');
  grunt.loadNpmTasks('grunt-text-replace');


  grunt.initConfig({
    webfont: {
      run: {
        src: PATH_BUILD_ICONS + '/*.svg',
        dest: PATH_DIST_FONTS,
        destCss: PATH_DIST_STYLES,
        options: {
          relativeFontPath: PATH_DIST_FONTS,
          stylesheets: ['less', 'scss', 'css'],
          htmlDemo: true,
          template: 'templates/template.css',
          htmlDemoTemplate: 'templates/template.html',
          htmlDemoFilename: 'template',
          destHtml: 'dist',
          fontFamilyName: 'Mikeozornin Some icons',
          font: 'Some',
          version: FONT_VERSION,
          types: 'woff,ttf',
          codepoints: CODEPOINTS,
          startCodepoint: 0xF701,
        }
      }
    },
    shell: {
      publish: { command: 'npm publish' },
      svgfromsubfolder: {
        command: 'find ' + PATH_BUILD_ICONS + ' -mindepth 2 -type f -print -exec mv {} ' + PATH_BUILD_ICONS + '/ \\;'
      },
      svgrename: {
        command: 'cd build/icons && for f in *.svg; do mv "$f" "${f}"; done'
      },
      svgcopytobuild: {
        command: 'mkdir -p ' + PATH_DIST_SVG + '; cd ' + PATH_BUILD_ICONS + ' && for f in *.svg; do cp "$f" "../../dist/svg/$f"; done'
      },
      figmaexport: {
        command: 'npm run export-icons'
      },
      cleanup: {
        command: 'rm -rf ./build; rm -rf ./dist'
      },
      remove_template: {
        command: 'rm dist/template.html'
      }
    },
    replace: {
      remove_mask: {
        src: [PATH_BUILD_ICONS + '/*.svg'],
        overwrite: true,                 // overwrite matched source files
        replacements: [
          { from: /<!--(.*?)-->\n/m, to: '' },
          // { from: /fill="#ABCDEF"/m, to: 'class="primary-color"' },
          { from: /fill="#EE30FF"/m, to: 'fill="currentColor"' },
          { from: / fill="(#(.*?)|none)"/gm, to: '' },
          { from: / stroke="(.*?)"/gm, to: '' },
          { from: /(\s*)<\/defs[\s\S]*<\/g>/m, to: '' },
          { from: /(\s*)<defs>/m, to: '' },
          { from: / id="(.*?)"/m, to: '' },
          { from: /xmlns:xlink="(.*?)"/m, to: '' },
          { from: /(\s*)<g[\s\S]*?>/m, to: '' },
          { from: /(\s*)<\/g>/m, to: '' },
          { from: /<svg/m, to: '<svg fill="#000"' },
          { from: / transform="(.*?)"/m, to: '' },
          { from: /<desc>(.*?)<\/desc>\n/m, to: '' },
          { from: /<title>(.*?)<\/title>\n/m, to: '' },
        ]
      }
    },
    svg_sprite: {
      basic: {
        expand: true,
        cwd: 'build/icons',
        src: ['*.svg'],
        dest: 'dist',
        options: {
          "svg": {
            "xmlDeclaration": false,
            "doctypeDeclaration": false,
            "namespaceIDs": false,
            "dimensionAttributes": false
          },
          "mode": {
            "symbol": {
              "prefix": ".sb-%s",
              "inline": true,
              "example": {
                "template": "dist/template.html",
                "dest": "../index.html"
              },
              render: {
                scss: true
              },
            }
          }
        }
      },
    },
  });

  grunt.registerTask('default',
  ['shell:cleanup', 
   'shell:figmaexport', 
   'shell:svgfromsubfolder', 
   'shell:svgcopytobuild', 
   'shell:svgrename', 
   'replace:remove_mask', 
   'webfont:run', 
   'svg_sprite:basic', 
   'shell:remove_template']);

  grunt.registerTask('publish', 
  ['shell:cleanup',
   'shell:figmaexport',
   'shell:svgfromsubfolder',
   'shell:svgcopytobuild',  
   'shell:svgrename', 
   'replace:remove_mask', 
   'webfont:run', 
   'svg_sprite:basic', 
   'shell:remove_template', 
   'shell:publish']);
};
