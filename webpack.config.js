module.exports = {
    context: __dirname + '/app',
    entry: {
        javascript: "./src/app.js",
        html: "./index.html"
    },
    module: {
        loaders: [
            {
                test: [ /\.js$/, /\.jsx$/ ],
                exclude: /node_modules/,
                loaders: ["react-hot-loader", "babel-loader?optional=es7.classProperties"]
            },
            {
                test: /\.html$/,
                loader: "file?name=[name].[ext]"
            }
        ]
    },
    resolve: {
        modulesDirectories: [ './node_modules', './src' ],
        extensions: [ '', '.js', '.jsx' ]
    },
    output: {
        filename: 'app.js',
        path: __dirname + '/dist'
    }
};
