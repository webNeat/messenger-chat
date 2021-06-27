import {EventEntry, WebhookEvent} from '../events/types'
import {BotConfig} from './types'

export async function handle(config: BotConfig, event: WebhookEvent) {
  if (event.object !== 'page') {
    throw `Unknown event.object value '${event.object}', it should be 'page'`
  }
  await Promise.all(event.entry.map(e => handleEntry(config, e)))
}

async function handleEntry(config: BotConfig, entry: EventEntry) {
  const messaging = entry.messaging[0]
  const {recipient, sender} = messaging
  const {accessToken, storage, send} = config
  const contextKey = `${sender.id}-${recipient.id}`
  const context = (await storage.get(contextKey)) || config.initialContext
  const setContext = (value: any) => storage.set(contextKey, value)
  let response = config.handle({...messaging, context, setContext})
  if (response instanceof Promise) {
    response = await response
  }
  if (response) {
    await send(accessToken, {
      messaging_type: 'RESPONSE',
      recipient: sender,
      message: response,
    })
  }
}
