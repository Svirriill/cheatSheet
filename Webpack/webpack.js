// npm init - создаём package.json и задаем ему значения
// npm i webpack --save-dev - устанавливаем в зависимости вебпак
// npm i webpack-cli --save-dev - интерфейс для взаимодействия с вебпаком через терминал
// npm i webpack-dev-server --save-dev - устанавливаем локальный сервер как зависимость
// npm i @babel/core --save-dev - бабель, транспилирует новый код в старый(для старых браузеров)
// npm i @babel/preset-env --save-dev - набор правил, по которым переводим код
//  npm i core-js --save - установка недостающей функциональности
//  npm i babel-loader --save-dev - устанавливает связь между бабелем и вебпаком
//  npm i html-webpack-plugin --save-dev - настраивает вебпак для работы с html-файлами
// npm i clean-webpack-plugin --save-dev - удаляет содержимое папки dist при каждой сборке
// npm i css-loader --save-dev - связывает css и вебпак
// npm i mini-css-extract-plugin --save-dev - соединяет несколько css-файлов в один
// npm i postcss-loader --save-dev - связывает PostCSS и вебпак
// npm i autoprefixer --save-dev - добавляет вендорные префиксы
// npm i cssnano --save-dev - минифицирует css код
// далее в package.json в объект scripts добавляем: 
// "scripts": {
//     "build": "rimraf dist && webpack -mode production",
//     "dev": "webpack serve"
//   }
// где build - имя выполняемого скрипта, 
// rimraf dist - удаление папки,
// webpack - запуск модуля
// webpack serve - запуск модуля на локальном сервере
// -mode production - указывает модулю на финальную сборку


// Создаем файл webpack.config.js, в котором будем описывать как собирать код Вебпаку
// В нем содержится:

// const path = require('path'); - абсолютный путь к точке выхода, специальная утилита
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// module.exports = {
//     entry: {
//         main: './src/index.js'
//     }, - точка входа
//     output: {
//         path: path.resolve(__dirname, 'dist'),
//         filename: 'main.js',
//         publicPath: ''
//     }, - точка выхода
//     mode: 'development', - режим разработчика
//     devServer: {
//         contentBase: path.resolve(__dirname, './dist'), - путь, для режима разработчика
//         compress: true, - ускорение загрузки в режиме разработки
//         port: 8080, - порт, по адресу которого открываем сайт
//         open: true - сайт открывается при запуске npm run dev
//     },
// rules: [{
//         test: /\.js$/,
//         use: 'babel-loader',
//         exclude: '/node_modules/'
//     },
//     {
//         test: /\.(png|svg|jpg|gif|woff(2)?|eot|ttf|otf)$/,
//         type: 'asset/resource'
//     },
//     {
//         test: /\.css$/,
//         use: [MiniCssExtractPlugin.loader, {
//                 loader: 'css-loader'
//             },
//             'postcss-loader'
//         ]
//     },
// ],
// plugins: [
//     new HtmlWebpackPlugin({
//       template: './src/index.html'
//     }),
//         new CleanWebpackPlugin(),
//   ]
// }

// Создаем babel.config.js в котором описываем какие версии должны поддерживаться
// module.exports.presets = [
//     ['@babel/env', {
//         targets: {
//             edge: '17',
//             ie: '11',
//             firefox: '50',
//             chrome: '64',
//             safari: '11.1'
//         },
//         useBuiltIns: "entry" - использовать полифиллы для брузеров
//     }]
// ];

// Создаем postcss.config.js в котором подключаем autoprefixer и cssnano
// const autoprefixer = require('autoprefixer');
// const cssnano = require('cssnano');

// module.exports = {
//     plugins: [
//       autoprefixer,
//       cssnano({ preset: 'default' }) - оставляем стандартные настройки
//     ]
//   }; 