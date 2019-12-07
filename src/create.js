const path = require('path')
const { promisify }  = require('util')
const shell = require('shelljs')
const axios = require('axios')
const ora = require('ora')
const inquirer = require('inquirer')
const downLoadGitRepo = require('download-git-repo')
const chalk = require('chalk')

let ncp = require('ncp')

// 转为promise格式
const downLoadGit = promisify(downLoadGitRepo)
ncp = promisify(ncp)
// 获取当前文件目录
const downLoadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME': 'USERPROFILE']}/.template`

const chalkSuccess = (text) => console.log(chalk.green(text))
const chalkError = (text) => console.log(chalk.red(text))

// 获取版本信息列表
const fetchTagsList = async (repo) => {
  const { data } = await axios.get(`https://api.github.com/repos/naihe138/nvue/tags`);
  return data
};

// 下载项目
const downLoad = async (tag) => {
  let api = `naihe138/nvue` // 下载项目
  if(tag) {
    api += `#${tag}`
  }
  const dest = `${downLoadDirectory}/nvue`
  await downLoadGit(api, dest)
  return dest
}

// 提示信息包裹函数
const wrapFetchAddLoading = (fn, message) => async (...args) => {
  const spinner = ora(message)
  spinner.start()
  const r = await fn(...args)
  spinner.succeed()
  return r
}

module.exports = async (projectName) => {
  // 选择版本
  let tags = await wrapFetchAddLoading(fetchTagsList, '正在获取版本号，请稍等...')('nvue')
  tags = tags.map(item => item.name)

  const { tag } = await inquirer.prompt({
    name: 'tag',
    type: 'list',
    message: '请选择版本',
    choices: tags
  })

  // 下载项目
  const target = await wrapFetchAddLoading(downLoad, '正在下载模板中，请稍等...')(tag)

  // 将下载的文件拷贝到当前执行命令的目录下
  let url = path.join(path.resolve(), projectName)
  await ncp(target, url)
  const { installWay } = await inquirer.prompt({
    name: 'installWay',
    type: 'list',
    message: '请选择安装方式',
    choices: [
      { name: 'cnpm install' },
      { name: 'yarn' },
      { name: 'npm install' }
    ]
  })
  spinner.start()
  shell.exec(`cd ${url} && ${installWay}`)
  spinner.succeed()
  chalkSuccess(`创建项目成功 请执行\n cd ${projectName}`)
}
