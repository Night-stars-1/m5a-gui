/*
 * @Author: Night-stars-1 nujj1042633805@gmail.com
 * @Date: 2024-09-07 15:14:53
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-09-08 19:59:49
 */
import fs from 'fs'
import * as maa from '@nekosu/maa-node'
import { BrowserWindow, ipcMain } from 'electron'
import { registerCustom } from './customMaa'
import logger, { log } from './utils/logger'
import { handleDebug } from './customMaa/debugType'

maa.set_global_option('DebugMessage', true)

let inst: maa.Instance
let win: BrowserWindow
let res: maa.Resource

async function getDevices() {
  // 查询所有Adb设备
  try {
    const devices = await maa.AdbController.find()
    if (!devices) {
      console.log('未找到设备')
      return []
    }
    return devices
  } catch {
    return []
  }
}

async function init(device: maa.AdbInfo) {
  // 创建控制器
  const ctrl = new maa.AdbController(device)
  ctrl.notify = (msg, detail) => {
    log(`${msg} ${detail}`)
    console.log(msg, detail)
  }
  // 连接设备
  await ctrl.post_connection()

  // 创建资源
  res = new maa.Resource()
  res.notify = (msg, detail) => {
    log(`${msg} ${detail}`)
    console.log(msg, detail)
  }
  // 加载资源
  await res.post_path('./resources/resource_picli/base')

  // 创建实例
  inst = new maa.Instance()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inst.notify = (msg: any, detail) => {
    // log(`${msg} ${detail}`)
    handleDebug({ msg, detail: JSON.parse(detail) })
    // console.log(msg, detail)
  }

  // 绑定控制器和资源
  inst.bind(ctrl)
  inst.bind(res)

  registerCustom(inst)
  return inst.inited
}

async function upRes() {
  res && (await res.post_path('./resources/resource_picli/base'))
}

async function start(task: Task[]) {
  // 检查是否正确创建
  log(`开始执行 ${inst.inited}`)

  // 执行任务
  for (const t of task) {
    const param = {}
    t.optionData?.forEach((item) => Object.assign(param, item))
    await inst.post_task(t.entry, param).wait()
  }
  log(`执行完毕`)
}

async function stop() {
  inst.post_stop()
}

function getInterface() {
  const data = fs.readFileSync('./resources/resource_picli/base/interface.json', {
    encoding: 'utf-8'
  })
  return data
}

ipcMain.on('maa-start', async (_, arg: string) => {
  if (!inst) {
    log('未初始化, 请前往设备选项卡，连接设备')
    return
  }
  const task: Task[] = JSON.parse(arg)
  start(task)
})

ipcMain.on('maa-stop', () => stop())

ipcMain.handle('maa-get-devices', () => getDevices())

ipcMain.handle('maa-device-load', (_, device) => init(device))

ipcMain.handle('maa-get-interface', () => getInterface())

export default (_win: BrowserWindow) => {
  win = _win
  logger(win)
}

export { upRes }
