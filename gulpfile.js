const{series, src, dest} = require('gulp');

function clean(cb) {
  console.log('Clean task is here for future dependency or directory cleanning.');
  cb();
}

function build(cb) {
  console.log('Building project!');
  cb();
}

function deploy() {
  console.log('Deploying project!');
  src('views/*')
    .pipe(dest('/var/www/html'));
  src('js/*')
  .pipe(dest('/var/www/html/js'));
  return src('css/*')
  .pipe(dest('/var/www/html/css'));
}

let deployMac = () => {
  console.log('Deploying to Mac folder!!')
  src('views/*')
    .pipe(dest('/Library/WebServer/Documents'));
  src('js/*')
    .pipe(dest('/Library/WebServer/Documents/js'));
  return src('css/*')
    .pipe(dest('/Library/WebServer/Documents/css'));
}

exports.build = build;
exports.deploy = deploy;
exports.deployMac = deployMac;
exports.default = series(clean, build, deploy);
