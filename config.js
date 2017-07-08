module.exports = {
    entry: 'src/index.js',
    dist: 'docs',
    html: {
        title: 'OP-Web'
    },
    webpack: {
        devtool: 'eval',
        output: {
            publicPath: ''
        }
    }
}
