/*
 * @Author: Night-stars-1 nujj1042633805@gmail.com
 * @Date: 2024-09-11 19:15:27
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-12-23 12:44:24
 */
import { getCustomProxy, getProxy, setCustomProxy, setProxy } from '@renderer/utils/proxyUtils'
import { defineStore } from 'pinia'

export const useProxyList = defineStore('proxyList', () => {
  const proxyList = [
    {
      name: 'https://ghgo.xyz/',
      url: 'https://ghgo.xyz/'
    },
    {
      name: '不代理',
      url: ''
    }
  ]
  const proxy = ref<string>('')
  const customProxy = ref<string>('')

  watch(
    () => proxy.value,
    (value) => {
      setProxy(value)
    }
  )
  watch(
    () => customProxy.value,
    (value) => {
      setCustomProxy(value)
    }
  )
  getProxy().then((item) => (proxy.value = item))
  getCustomProxy().then((item) => (customProxy.value = item))
  return { proxy, customProxy, proxyList }
})
