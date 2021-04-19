const chalk = require("chalk");

module.exports.taskNameWrite = (gulpTaskName) => {
  console.log(
    " 🚀🚀🚀 " + chalk.bgBlueBright(` ${gulpTaskName} `) + " 🚀🚀🚀 "
  );
};

module.exports.checkGreenWrite = (target) => {
  console.log(chalk.greenBright(`✓ `) + `${target}`);
};
