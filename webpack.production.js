/* eslint-disable @typescript-eslint/no-var-requires */
const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const {InjectManifest} = require('workbox-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    devtool: false,
    plugins: [
        new InjectManifest({
            swSrc: './src/service-worker.ts',
            swDest: 'service-worker.js',
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
            exclude: [/\.map$/, /^manifest.*\.js$/],
        }),
    ],
});
