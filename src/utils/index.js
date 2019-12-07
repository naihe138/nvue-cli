const { name, version } = require('../../package.json')

const configFile = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.nvuerc`

const defaultConfig = {
  repo: 'nvue-cli', // 默认拉取的仓库名
};

module.exports = {
  name, 
  version,
  defaultConfig,
  configFile
}
