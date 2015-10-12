var webpack = require('webpack');

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['mocha'],
        files: [
            './spec/*Spec.js',
            'spec/**/*Spec.js'
        ],
        preprocessors: {
            './spec/*Spec.js': ['webpack'],
            './spec/**/*Spec.js': ['webpack']
        },
        browsers: [
            'PhantomJS'
        ],
        webpack: {
            resolve: {
                modulesDirectories: [ './node_modules', './app/src', './spec' ],
                extensions: [ '', '.js', '.jsx' ]
            },
            module: {
                loaders: [
                    {
                        test: [ /\.js$/, /\.jsx$/ ],
                        exclude: /node_modules/,
                        loaders: ['babel-loader?optional[]=es7.classProperties&optional[]=runtime']
                    },
                ]
            }
        },
        webpackMiddleware: {
            noInfo: true
        },
        reporters: [
            'spec'
        ],
        singleRun: true,
        plugins: [
            require('karma-webpack'),
            require('karma-mocha'),
            require('karma-spec-reporter'),
            require('karma-phantomjs-launcher')
        ]
    });
};
