import chalk from 'chalk'

const ctx = new chalk.Instance({level: 2});

export default class Logger {
  static log(message) {
    console.log(message);
  }

  static info(message) {
    console.log(ctx.cyan(message));
  }

  static success(message) {
    console.log(ctx.green(message));
  }

  static warning(message) {
    console.log(ctx.yellow(message));
  }

  static error(message) {
    console.log(ctx.red(message));
  }
}
