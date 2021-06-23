import {BotConfig, ChatStep} from './types'

export async function addStep(config: BotConfig, name: string, step: ChatStep) {
  if (!name) {
    throw `The chat step name should not be empty`
  }
  if (config.steps[name]) {
    throw `The chat step '${name}' is already defined`
  }
  config.steps[name] = step
}
