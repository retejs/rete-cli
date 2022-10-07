import chalk from 'chalk'

export const messages = {
    lintingFail: chalk.redBright('Linting failed'),
    lintingSuccess: chalk.green('Linting completed'),
    typesFail: chalk.redBright('Type generating failed'),
    typesSuccess: chalk.green('Types generated')
}
