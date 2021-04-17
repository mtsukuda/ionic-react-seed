const chalk = require("chalk");

module.exports.headLine = (gulpTaskName) => {
  console.log(
    " 🚀🚀🚀 " + chalk.black.bgCyanBright(` ${gulpTaskName} `) + " 🚀🚀🚀 "
  );
};
