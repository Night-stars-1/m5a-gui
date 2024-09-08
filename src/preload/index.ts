/*
 * @Author: Night-stars-1 nujj1042633805@gmail.com
 * @Date: 2024-09-07 12:59:24
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-09-08 22:46:13
 */
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type * as maa from '@nekosu/maa-node'

// Custom APIs for renderer
const api = {
  start: (param: Task[]) => ipcRenderer.send('maa-start', param),
  stop: () => ipcRenderer.send('maa-stop'),
  getDevices: () => ipcRenderer.invoke('maa-get-devices'),
  deviceLoad: (device: maa.AdbInfo) => ipcRenderer.invoke('maa-device-load', device),
  log: (callback: (event: Electron.IpcRendererEvent, message: string) => void) =>
    ipcRenderer.on('log-message', callback),
  upDate: (version: string) => ipcRenderer.send('res-update', version),
  isUpdate: () => ipcRenderer.invoke('res-is-update'),
  getInterface: () => ipcRenderer.invoke('maa-get-interface'),
  onStartRecognize: (
    callback: (event: Electron.IpcRendererEvent, name: string, next: string[]) => void
  ) => ipcRenderer.on('maa-start-recognize', callback),
  onEndRecognize: (
    callback: (event: Electron.IpcRendererEvent, id: number, name: string, status: boolean) => void
  ) => ipcRenderer.on('maa-end-recognize', callback),
  queryRecognitionDetail: (recoId: number) =>
    ipcRenderer.invoke('maa-query-recognition-detail', recoId)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
