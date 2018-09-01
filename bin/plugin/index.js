const fs = require('fs');
const Case = require('case');
const copyDir = require('copy-dir');
const replace = require('replace-in-file');
const { version } = require('../../package.json');

function renderTemplates(folder, locals) {
    const keys = Object.keys(locals);
    const from = keys.map(key => '{{'+key+'}}');
    const to = keys.map(key => locals[key]);

    replace.sync({
        files: `${folder}/*`,
        from,
        to
    })
}

function createDir(folder) {
    fs.mkdirSync(folder);
    copyDir.sync(`${__dirname}/boilerplate`, folder);
}

module.exports = async (program) => {
    const name = program.plugin.toLowerCase();
    const pluginName = Case.capital(`${name}`);
    const packageName = Case.kebab(`rete ${name} plugin`);
    const namespace = Case.pascal(`${name} plugin`);
    const bundleName = Case.kebab(`${name} plugin`);
    const folderName = Case.kebab(`${name} plugin`);
    const cliVersion = version;
    
    createDir(folderName);
    renderTemplates(folderName, {
        pluginName,
        packageName,
        namespace,
        bundleName,
        folderName,
        cliVersion
    });
}