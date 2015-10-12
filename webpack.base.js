var webpack = require('webpack');

module.exports = function(options) {
    var plugins = [
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
    ];

    if (options.hot) {
        plugins.push(new webpack.NoErrorsPlugin());
    }

    if (options.minimize) {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.optimize.DedupePlugin()
        );
    }

    return {
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
                    loaders: options.hot
                        ? ['react-hot-loader', 'babel-loader?optional=es7.classProperties']
                        : ['babel-loader?optional=es7.classProperties']
                },
                {
                    test: /\.html$/,
                    loader: "file?name=[name].[ext]"
                }
            ]
        },
        debug: options.debug,
        devtool: options.devtool,
        resolve: {
            modulesDirectories: [ './node_modules', './src' ],
            extensions: [ '', '.js', '.jsx' ]
        },
        plugins: plugins,
        output: {
            filename: 'app.js',
            path: __dirname + '/dist'
        }
    };
};
