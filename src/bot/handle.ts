import {send} from './send'
import {BotConfig, EventEntry, WebhookEvent} from '../types'

export async function handle(config: BotConfig, event: WebhookEvent) {
  if (event.object !== 'page') {
    throw `Unknown event.object value '${event.object}', it should be 'page'`
  }
  await Promise.all(event.entry.map(e => handleEntry(config, e)))
}

async function handleEntry(config: BotConfig, entry: EventEntry) {
  const messaging = entry.messaging[0]
  const {recipient, sender} = messaging
  const {storage, initialContext} = config
  const contextKey = `${sender.id}-${recipient.id}`
  const context = (await storage.get(contextKey)) || initialContext
  const setContext = (value: any) => storage.set(contextKey, value)
  const getUserFields = () => loadUserFields(config, sender)
  let responses = config.handle({...messaging, contextKey, context, setContext, getUserFields})
  if (responses instanceof Promise) {
    responses = await responses
  }
  if (responses && !Array.isArray(responses)) {
    responses = [responses]
  }
  if (responses) {
    await Promise.all(responses.map(response => send(config, sender.id, response)))
  }
}

async function loadUserFields({axiosInstance, accessToken}: BotConfig, sender: {id: string}) {
  const res = await axiosInstance.get(
    `https://graph.facebook.com/v11.0/${sender.id}?access_token=${accessToken}&fields=id,first_name,last_name,profile_pic`
  )
  return res.data
}
