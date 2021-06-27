import axios from 'axios'
import {handle} from './handle'
import {verify} from './verify'
import {Bot, BotConfig} from './types'
import {memoryStorage} from '../storages'

const axiosInstance = axios.create()

export function bot(config: Partial<BotConfig>): Bot {
  if (!config.accessToken) throw `The accessToken is missing on the bot configuration!`
  if (!config.verifyToken) throw `The verifyToken is missing on the bot configuration!`
  if (!config.handle) throw `handle is missing on the bot configuration!`

  config = {
    initialContext: {},
    storage: memoryStorage(),
    send: (token, data) =>
      axiosInstance.post(
        `https://graph.facebook.com/v11.0/me/messages?access_token=${token}`,
        data
      ),
    ...config,
  }

  return {
    verify: query => verify(config as BotConfig, query),
    handle: event => handle(config as BotConfig, event),
  }
}
