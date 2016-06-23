import {join} from 'path';
import {APP_SRC} from '../config';

// compiles all ts files (except tests/template ones) and type definitions,
// replace templates in them and adds sourcemaps and copies into APP_DEST
export = function buildCss(gulp, plugins) {
    //the title and icon that will be used for the Grunt notifications
    var notifyInfo = {
    	title: 'Gulp',
    	icon: require.resolve('gulp-notify/assets/gulp-error.png')
    };

    //error notification settings for plumber
    var plumberErrorHandler = { errorHandler: plugins.notify.onError({
    		title: notifyInfo.title,
    		icon: notifyInfo.icon,
    		message: 'Error: <%= error.message %>'
    	})
    };


  return function () {
    // src files are all ts files (except tests/template ones) and type definitions
    let src = [
      join(APP_SRC, '**/sass/*.scss')
    ];
    return gulp.src(src)
      .pipe(plugins.plumber(plumberErrorHandler))
      .pipe(plugins.sass())
      .pipe(gulp.dest(APP_SRC));
  };
};
