/*
 * @Author: Night-stars-1 nujj1042633805@gmail.com
 * @Date: 2024-09-11 19:17:40
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-12-23 12:24:51
 */
import localforage from 'localforage'

async function getProxy() {
  return (await localforage.getItem<string>('proxy')) ?? ''
}

async function setProxy(url: string) {
  return await localforage.setItem<string>('proxy', url)
}

async function getCustomProxy() {
  return (await localforage.getItem<string>('custom_proxy')) ?? ''
}

async function setCustomProxy(url: string) {
  return await localforage.setItem<string>('custom_proxy', url)
}

export { getProxy, setProxy, getCustomProxy, setCustomProxy }
