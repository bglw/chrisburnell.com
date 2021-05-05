const htmlmin = require('html-minifier')

module.exports = function htmlMinTransform(value, outputPath) {
    if (outputPath.indexOf('.html') > -1) {
        return htmlmin.minify(value, {
            useShortDoctype: false,
            removeComments: false,
            collapseWhitespace: false,
            minifyCSS: true
        })
    }
    return value
}
