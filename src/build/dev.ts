import chalk from 'chalk'
import ms from 'pretty-ms'
import { RollupOptions, watch } from 'rollup'

import { lint } from '../lint/linter';
import { messages } from './consts';
import { generateTypes } from './gen-types';
import { safeExec } from './utils';

export async function buildDev(name: string, config: RollupOptions, outputDirectory: string) {
    const watcher = watch(config);

    // eslint-disable-next-line max-statements
    watcher.on('event', async e => {
        if (e.code === 'START') {
            console.log('\n\n\n')

            safeExec(lint, messages.lintingFail)
            safeExec(() => generateTypes(outputDirectory), messages.typesFail)
        } else if (e.code === 'BUNDLE_START') {
            console.log(chalk.green(`Start building ${name} ...`));
        } else if (e.code === 'BUNDLE_END') {
            const duration = ms(e.duration, { secondsDecimalDigits: 1 })

            console.log(chalk.green(`Build ${name} completed in ${duration}`));
        } else if (e.code === 'ERROR') {
            const { id, loc/*, codeFrame*/ } = e.error;

            console.log(chalk.red('Error', e.error.message));
            if (loc) console.log(chalk.green(id+':'+loc.line));
            // log(codeFrame); break;
        }
    });
}
