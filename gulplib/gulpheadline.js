const chalk = require("chalk");

module.exports.taskNameWrite = (gulpTaskName) => {
  console.log(
    " 🚀🚀🚀 " + chalk.bgBlueBright(` ${gulpTaskName} `) + " 🚀🚀🚀 "
  );
};
