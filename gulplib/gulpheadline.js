const chalk = require("chalk");

module.exports.taskNameWrite = (gulpTaskName) => {
  console.log(
    " 🚀🚀🚀 " + chalk.bgBlueBright(` ${gulpTaskName} `) + " 🚀🚀🚀 "
  );
};

module.exports.noteWrite = (gulpNote) => {
  console.log(" 📣🥸 " + chalk.green(` ${gulpNote} `));
};

module.exports.checkGreenWrite = (target) => {
  console.log(chalk.greenBright(`✓ `) + `${target}`);
};
