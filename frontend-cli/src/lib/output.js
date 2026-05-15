import chalk from "chalk";
import Table from "cli-table3";

export function printSuccess(message) {
  console.log(chalk.green(`✔ ${message}`));
}

export function printError(message) {
  console.error(chalk.red(`✖ ${message}`));
}

export function printInfo(message) {
  console.log(chalk.cyan(`ℹ ${message}`));
}

export function printWarning(message) {
  console.log(chalk.yellow(`⚠ ${message}`));
}

export function printTable(head, rows) {
  const table = new Table({ head });
  rows.forEach((row) => table.push(row));
  console.log(table.toString());
}
