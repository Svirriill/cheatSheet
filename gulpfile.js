// 1 - создаем переменные и присваиваем  им пути к папкам/файлам проекта
// это делается для того, чтобы в случае, если мы захотим переименовать папку,
// мы могли сделать это в одном месте

// папка в которую выводится результат работа gulp(собирается проект)
let project = 'dist';
// папка с исходниками
let source = 'src';
// path - содержит объекты, которые в свою очередь содержат пути к папкам/файлам
let path = {
    // куда gulp выгружает обработанный файл(dist)
    build: {
        html: project + '/',
        css: project + '/css/',
        js: project + '/js/',
        img: project + '/img/',
        fonts: project + '/fonts/'
    },
    // папка с исходниками
    src: {
        html: [source + '/*.html', '!' + source + '/_*.html'], // - дабы не захламлять наш dist кучей header.html, nav.html и т.д.,
        // мы называем эти файлы начиная с "_" и закидываем их в исключения dist, при этом их контент не теряется
        css: source + '/css/style.css', // - обрабатывает только 1 файл, который содержит остальные подключенные файлы
        js: source + '/js/script.js', // - аналогично
        img: source + '/img/**/*.{jpg, png, svg}', // - ** - все подпапки, *.{...} - все файлы, с форматом {...} 
        fonts: source + '/fonts/*.ttf' // - аналогично
    },
    // содержит в себе пути к файлам, в которых мы отлавливаем изменения и сразу выполняем
    watch: {
        html: project + '/**/*.html',
        css: project + '/**/*.css/',
        js: project + '/**/*.js/',
        img: project + '/img/**/*.{jpg, png, svg}',
    },
    // удаляет папку каждый раз при запуске gulp
    clean: './' + project + '/'
};

let (src, dest) = require('gulp');
let gulp = require('gulp');
browsersync = require('browser-sync').create();
fileinclude = require('gulp-file-include'); // *
del = require('del');
scss = require('gulp-sass');
autoprefixer = require('gulp-autoprefixer');
cleancss = require('gulp-clean-css');
rename = require('gulp-rename');
uglify = require('gulp-uglify-es').default;
imagemin = require('gulp-imagemin');
webphtml = require('gulp-webp-html');
webpcss = require('gulp-webpcss');
ttf2woff = require('gulp-ttf2woff');
ttf2woff2 = require('gulp-ttf2woff2');
// функция для работы с html
function html() {
    // обращаемся к исходникам
    return src(path.src.html)
        // собираем файлы
        .pipe(dest(fileinclude()))
        // сокращение кода при добавление картинки
        .pipe(webphtml())
        // перебрасываем файлы в папку назначения через .pipe()
        .pipe(dest(path.build.html))
        //обновляем страницу
        .pipe(dest(browsersync.stream()))
};

// функция для работы с css
function css() {
    // обращаемся к исходникам
    return src(path.src.css)
        // ** собираем файлы 
        .pipe(dest(fileinclude()))
        // при преобразование scss
        // .pipe(
        //     scss({
        //         outputStyle: 'expended' // - одна из настроек, файл не сжимается
        //     })
        // )
        // добавляем автопрефиксы каскадом на последние 5 версий браузера
        // .pipe(
        //     autoprefixer({
        //         overrideBrowserslist: ['last 5 versions'],
        //         cascade: true
        //     })
        // )
        .pipe(webpcss())
        // дважды выгружаем css сжатый и нет 
        .pipe(dest(path.build.css))
        // минимизация css
        .pipe(cleancss())
        // переименовываем
        .pipe(rename({
            'extname': '.min.css'
        }))
        // перебрасываем файлы в папку назначения через .pipe()
        .pipe(dest(path.build.css))
        // обновляем страницу
        .pipe(dest(browsersync.stream()))
};

// функция для работы с js
function js() {
    // обращаемся к исходникам
    return src(path.src.js)
        // собираем файлы
        .pipe(dest(fileinclude()))
        // дважды выгружаем js сжатый и нет 
        .pipe(dest(path.build.js))
        // минимизация js
        .pipe(uglify())
        // переименовываем
        .pipe(rename({
            'extname': '.min.js'
        }))
        // перебрасываем файлы в папку назначения через .pipe()
        .pipe(dest(path.build.js))
        //обновляем страницу
        .pipe(dest(browsersync.stream()))
};

// функция для работы с картинками
function images() {
    // обращаемся к исходникам
    return src(path.src.img)
        .pipe(
            imagemin({
                // настройки оптимизации
            })
        )
        // перебрасываем файлы в папку назначения через .pipe()
        .pipe(dest(path.build.img))
        //обновляем страницу
        .pipe(dest(browsersync.stream()))
};

function fonts() {
    src(path.src.fonts)
        .pipe(ttf2woff())
        // перебрасываем файлы в папку назначения через .pipe()
        .pipe(dest(path.build.fonts))
    src(path.src.fonts)
        .pipe(ttf2woff2())
        // перебрасываем файлы в папку назначения через .pipe()
        .pipe(dest(path.build.fonts))
}
// функция перезагрузки страницы
function browserSync() {
    browsersync.init({
        server: {
            baseDir: './' + project + '/'
        },
        port: n,
        notify: false // - объявление о обновление страницы
    })
};
// функция отслеживания изменений "на лету"
function watchFiles() {
    // плагин(путь + функция)
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
};

// функция удаления папки
function clean() {
    return del(path.clean);
};

// прописываем функции, которые должны выполняться
let build = gulp.series(clean, gulp.parallel(fonts, images, js, css, html));
let watch = gulp.parallel(build, watchFiles, browserSync);

// связываем gulp с новыми переменными

exports.fonts = fonts;
exports.images = images;
exports.html = html;
exports.css = css;
exports.js = js;
exports.build = build;
exports.watch = watch;
exports.default = watch;

// Доп. пакеты в package:
// npm i browser-sync --save-dev - перезагрузка страницы
// npm i gulp-file-include --save-dev - собирает файлы по частям(header, footer  и т.д.)
// npm i del --save-dev - пакет для удаления папок/файлов
// npm i gulp-sass --save-dev - преобразует scss в css
// npm i gulp-autoprefixer --save - автоматически добавляет вендорные префиксы
// npm i gulp-clean-css --save-dev - сжимает css-файл на выходе
// npm i gulp-rename --save-dev - переименовывает файлы
// npm i gulp-uglify-es --save-dev - сжимает js
// npm i gulp-imagemin --save-dev - сжимает картинки
// npm i gulp-webp-html --save-dev - короткая запись добавления картинки в html
// npm i gulp-webpcss --save-dev - сокращение css-кода
// npm i gulp-ttf2woff gulp-ttf2woff2 --save-dev - плагины для работы с шрифтами


// * в основной html-файл подключаем дополнительные через @@include('name-file.html');
// ** в случае, если мы преобразуем scss в css fileinclude нам не нужен