import chalk from 'chalk'
import ms from 'pretty-ms'
import { RollupOptions, watch } from 'rollup'

import { lint } from '../lint/linter';
import { generateTypes } from './gen-types';
import { safeExec } from './utils';

export async function buildDev(sourceConfig: ReteOptions, config: RollupOptions) {
    const watcher = watch(config);

    watcher.on('event', async e => {
        switch (e.code) {
        case 'START':
            console.log('\n\n\n')
            safeExec(lint, chalk.redBright('Linting failed'))
            safeExec(generateTypes, chalk.redBright('Type generating failed'))
            break;
        case 'BUNDLE_START':
            console.log(chalk.green(`Start building ${sourceConfig.name} ...`));
            break;
        case 'BUNDLE_END':
            // eslint-disable-next-line no-case-declarations
            const duration = ms(e.duration, { secondsDecimalDigits: 1 })

            console.log(chalk.green(`Build ${sourceConfig.name} completed in ${duration}`));
            break;
        case 'END':
            break;
        default:
            // eslint-disable-next-line no-case-declarations
            const { id, loc/*, codeFrame*/ } = e.error;

            console.log(chalk.red('Error', e.error.message));
            if (loc) console.log(chalk.green(id+':'+loc.line));
            // log(codeFrame); break;
        }
    });
}
