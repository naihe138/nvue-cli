const program = require('commander')
const path = require('path')
const { name, version } = require('./utils')

const actionsMap = {
  create: {
    description: 'create project',
    alias: 'cr',
    examples: ['nvue create <template-name>']
  },
  config: {
    description: 'config info',
    alias: 'c',
    examples: ['nvue config get <k>', 'nvue config set <k> <v>']
  },
  '*': {
    description: 'command not found'
  }
}

Object.keys(actionsMap).forEach(action => {
  program
    .command(action)
    .alias(actionsMap[action].alias)
    .description(actionsMap[action].description)
    .action(() => {
      // 动作
      if (action === '*') {
        console.log(actionsMap[action].description)
      } else {
        require(path.resolve(__dirname, action))(...process.argv.slice(3))
      }
      // console.log('执行动作', action)
    })
})

program.on('--help', () => {
  console.log('Examples')
  Object.keys(actionsMap).forEach(action => {
    (actionsMap[action].examples || []).forEach(example => {
      console.log(example)
    })
  })
})

program.version(version).parse(process.argv)
