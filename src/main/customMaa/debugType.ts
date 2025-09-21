/*
 * @Author: Night-stars-1 nujj1042633805@gmail.com
 * @Date: 2024-09-08 19:52:43
 * @LastEditors: Night-stars-1 nujj1042633805@gmail.com
 * @LastEditTime: 2024-10-05 16:11:40
 */
import maa from '@maaxyz/maa-node'
import { log, sendEndRecognize, sendStartRecognize } from '../utils/logger'

function handleDebug(data: maa.TaskerNotify) {
  const type = data.msg
  switch (type) {
    case 'NextList.Starting':
      sendStartRecognize(data.name, data.list)
      break
    case 'NextList.Failed':
      break
    case 'NextList.Succeeded':
      break
    case 'Recognition.Starting':
      break
    case 'Recognition.Succeeded':
      sendEndRecognize(Number(data.reco_id), data.name, true)
      break
    case 'Recognition.Failed':
      sendEndRecognize(Number(data.reco_id), data.name, false)
      break
    default:
      if (type.startsWith('Task.Debug')) return
      log(`${type} ${JSON.stringify(data)}`)
      // logger.debug(`${type} ${JSON.stringify(data.detail)}`)
      break
  }
}

export { handleDebug }
