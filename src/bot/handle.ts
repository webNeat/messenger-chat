import {WebhookEvent, EventEntry} from '../events'
import { MessagingItem } from '../events/types'
import {Message, MessageReply, MessageBuilder} from '../messages'
import {BotConfig, ChatState} from './types'

export async function handle(config: BotConfig, event: WebhookEvent) {
  if (event.object !== 'page') {
    throw `Unknown event.object value '${event.object}', it should be 'page'`
  }
  await Promise.all(event.entry.map(e => handleEntry(config, e)))
}

async function handleEntry(config: BotConfig, entry: EventEntry) {
  const messaging = entry.messaging[0]
  const sender = messaging.sender
  const state = await getState(config, sender.id)
  const step = await listen(config, state, messaging)
  const reply = makeReply(sender, await step.send(state.context))
  await Promise.all([config.send(config.accessToken, reply), setState(config, sender.id, state)])
}

async function listen(config: BotConfig, state: ChatState, messaging: MessagingItem) {
  if (!state.step) {
    state.step = 'start'
    return config.steps['start']
  }
  const {sender, message, postback} = messaging as any
  const step = config.steps[state.step]
  const setContext = async (value: any) => {
    state.context = value
    return setState(config, sender.id, state)
  }
  const nextStep = await step.listen({message, postback, context: state.context, setContext})
  if (!nextStep) {
    return step
  }
  if (!config.steps[nextStep]) {
    throw `Unknown chat step '${nextStep}'`
  }
  state.step = nextStep
  return config.steps[nextStep]
}

async function getState(config: BotConfig, key: string): Promise<ChatState> {
  const value = await config.storage.get(key)
  if (value == undefined) {
    return {step: '', context: {...config.initialContext}}
  }
  return JSON.parse(value)
}

async function setState(config: BotConfig, key: string, state: ChatState): Promise<void> {
  await config.storage.set(key, JSON.stringify(state))
}

function makeReply(recipient: {id: string}, message: MessageBuilder<Message>): MessageReply {
  return {
    recipient,
    messaging_type: 'RESPONSE',
    message: message.get(),
  }
}
