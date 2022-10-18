import fs from 'fs'
import inquirer from 'inquirer'
import { join } from 'path'

export async function choosePackages(currentDirectory: string): Promise<string[]> {
    const folders = (await fs.promises.readdir(currentDirectory, { withFileTypes: true }))
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .filter(name => fs.existsSync(join(name, 'package.json')))

    const { packages } = await inquirer.prompt<{ packages: string[] }>([
        {
            type: 'checkbox',
            message: 'Select packages',
            name: 'packages',
            choices: folders.map(name => ({ name }))
        }
    ])

    return packages
}

export enum Approach {
  Print = 'print',
  InPlace = 'in-place'
}

export async function chooseApproach(): Promise<Approach> {
    const { approach } = await inquirer.prompt<{ approach: Approach }>([
        {
            type: 'list',
            message: 'Select output type',
            name: 'approach',
            choices: [
                { name: 'print (run commands manually)', value: Approach.Print },
                { name: 'in place (run commands in current terminal)', value: Approach.InPlace }
            ]
        }
    ])

    return approach
}
