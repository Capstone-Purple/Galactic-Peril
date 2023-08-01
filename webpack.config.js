module.exports = {
    mode: 'development',
    entry: ['./src/index.js'],
    output: {
        path: __dirname,
        filename: './static/main.js'
    },
    devtool: 'source-map',
    module: {
        rules: [{
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    }
}