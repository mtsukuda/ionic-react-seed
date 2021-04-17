const chalk = require("chalk");

module.exports.taskNameWrite = (gulpTaskName) => {
  console.log(
    " 🚀🚀🚀 " + chalk.black.bgCyanBright(` ${gulpTaskName} `) + " 🚀🚀🚀 "
  );
};
