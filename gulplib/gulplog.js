const chalk = require("chalk");

module.exports.logKeyVal = (key, val, separate = " ") => {
  return chalk.magenta(`${key}`) + separate + val;
};

module.exports.logKeyValYesNo = (key, val, separate = " ") => {
  return (
    chalk.magenta(`${key}`) +
    separate +
    (val ? chalk.green(`yes`) : chalk.red(`no`))
  );
};
