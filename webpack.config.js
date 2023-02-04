const path = require('path')

module.exports = {
    mode: 'development',
    
    entry: './src/main.tsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, "dist"),
        publicPath: '/dist'
    },

    devServer: {
        open: true,

        
        static: [
            {
                directory: path.resolve(__dirname, 'dist'),
                publicPath: "./dist"
            },

            {
                directory: __dirname,
                publicPath: '/'
            }
        ]
    },

    devtool: 'eval',

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.tsx$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.jsx$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react']
                    }
                },
                exclude: /node_modules/
            },
        ]
    },

    resolve: {
        extensions: ['.ts', '.js', '.jsx', '.tsx']
    }
}