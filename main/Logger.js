import chalk from 'chalk'

const ctx = new chalk.Instance({level: 2});

export default class Logger {
  static log(message) {
    console.log(`[ LOG ] --- ${message}`);
  }

  static info(message) {
    console.log(ctx.cyan(`[ INFO ] --- ${message}`));
  }

  static success(message) {
    console.log(ctx.green(`[ SUCCESS ] --- ${message}`));
  }

  static warning(message) {
    console.log(ctx.yellow(`[ WARNING ] --- ${message}`));
  }

  static error(message) {
    console.log(ctx.red(`[ ERROR ] --- ${message}`));
  }

  static list(list) {
    console.log(ctx.inverse("["));
    for(let i = 0; i < list.length; i++) {
      console.log(ctx.bgMagenta(list[i]));
    }
    console.log(ctx.inverse("]"));
  }
}
