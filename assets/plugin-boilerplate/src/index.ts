import { NodeEditor } from 'rete'

function install(editor: NodeEditor, params: Record<string, any>) {
    console.log('Rete.js plugin boilerplate', { editor, params })
}

export default {
    name: '{{id}}',
    install
}
