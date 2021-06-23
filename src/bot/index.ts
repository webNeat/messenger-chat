import {send} from './send'
import {handle} from './handle'
import {verify} from './verify'
import {addStep} from './addStep'
import {Bot, BotConfig} from './types'
import {memoryStorage} from '../storages'

export function bot(config: Partial<BotConfig>): Bot {
  if (!config.accessToken) throw `The accessToken is missing on the bot configuration!`
  if (!config.verifyToken) throw `The verifyToken is missing on the bot configuration!`
  if (!config.send) config.send = send
  if (!config.storage) config.storage = memoryStorage()
  if (!config.initialContext) config.initialContext = {}
  if (!config.steps) config.steps = {}

  return {
    on: (name, step) => addStep(config as BotConfig, name, step),
    verify: query => verify(config as BotConfig, query),
    handle: event => handle(config as BotConfig, event),
  }
}
